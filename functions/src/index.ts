import { onRequest, Request } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineString } from "firebase-functions/params";
import type { Response } from "express";
import { Web3 } from "web3";
import { reclammAbi } from "./abi/reclammAbi";
import { stablePoolAbi } from "./abi/stablePoolAbi";
import { vaultExtensionAbi } from "./abi/vaultExtensionAbi";
import { stableSurgeAbi } from "./abi/stableSurgeAbi";
import { erc20Abi } from "./abi/erc20Abi";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Never committed: the deploy reads it from a dotenv file that CI writes from
// a repository secret. See "How to Deploy" in the README.
const alchemyApiKey = defineString("ALCHEMY_API_KEY");

// The network name becomes part of the RPC host name, so only the networks
// the client offers are accepted. Keep in sync with client/src/constants.ts.
const ALCHEMY_NETWORKS = new Set([
  "base-mainnet",
  "plasma-mainnet",
  "eth-mainnet",
  "eth-sepolia",
  "opt-mainnet",
  "arb-mainnet",
  "gnosis-mainnet",
  "avax-mainnet",
  "sonic-mainnet",
]);

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

function convertBigIntToNumber(obj: any): any {
  if (typeof obj === "bigint") {
    return Number(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertBigIntToNumber(v)])
    );
  }
  return obj;
}

// Reads `network` and `address` from the query string. If either is invalid,
// sends a 400 response and returns undefined.
function readPoolParams(
  request: Request,
  response: Response
): { network: string; address: string } | undefined {
  const { network, address } = request.query;

  if (typeof network !== "string" || !ALCHEMY_NETWORKS.has(network)) {
    logger.error("Unsupported network parameter", { query: request.query });
    response.status(400).send("Unsupported 'network' query parameter.");
    return undefined;
  }

  if (typeof address !== "string" || !ADDRESS_PATTERN.test(address)) {
    logger.error("Invalid address parameter", { query: request.query });
    response.status(400).send("Invalid 'address' query parameter.");
    return undefined;
  }

  return { network, address };
}

// Describes the error for logging, with the API key removed. A failed RPC
// request reports its full URL, which contains the key.
function describeError(error: unknown): string {
  const details = String(error instanceof Error ? error.stack : error);
  const key = alchemyApiKey.value();
  return key ? details.split(key).join("<ALCHEMY_API_KEY>") : details;
}

// Sends a 500 response, without the error details, if the handler throws.
function withErrorHandling(
  handler: (request: Request, response: Response) => Promise<void>
) {
  return async (request: Request, response: Response) => {
    try {
      await handler(request, response);
    } catch (error) {
      logger.error("Request failed", {
        query: request.query,
        error: describeError(error),
      });
      if (!response.headersSent) {
        response.status(500).send("Failed to load pool data.");
      }
    }
  };
}

export const autorangeData = onRequest(
  { cors: true },
  withErrorHandling(async (request, response) => {
    logger.info("Received request", { query: request.query });

    const params = readPoolParams(request, response);
    if (!params) {
      return;
    }
    const { network, address } = params;

    const rpcUrl = `https://${network}.g.alchemy.com/v2/${alchemyApiKey.value()}`;

    const web3 = new Web3(rpcUrl);

    const contract = new web3.eth.Contract(reclammAbi, address);

    const [
      priceRange,
      virtualBalances,
      realBalances,
      dailyPriceShiftExponent,
      centerednessMargin,
    ] = (
      await Promise.all([
        contract.methods.computeCurrentPriceRange().call(),
        contract.methods.computeCurrentVirtualBalances().call(),
        contract.methods.getCurrentLiveBalances().call(),
        (async () => {
          try {
            return await contract.methods.getDailyPriceShiftExponent().call();
          } catch (error) {
            // Compatibility with V1
            try {
              const priceShiftBase = convertBigIntToNumber(
                await contract.methods.getPriceShiftDailyRateInSeconds().call()
              );
              return priceShiftBase * 124649;
            } catch (error) {
              logger.error("Error getting daily price shift exponent", {
                error: describeError(error),
              });
              return 1e18;
            }
          }
        })(),
        contract.methods.getCenterednessMargin().call(),
      ])
    ).map((obj) => convertBigIntToNumber(obj));

    // Send the JSON response
    response.json({
      priceRange,
      virtualBalances,
      realBalances,
      dailyPriceShiftExponent,
      centerednessMargin,
    });
  })
);

// The deployed site predates the AutoRange rename and still calls this name.
export const reclammData = autorangeData;

export const stableSurgeData = onRequest(
  { cors: true },
  withErrorHandling(async (request, response) => {
    logger.info("Received request", { query: request.query });

    const params = readPoolParams(request, response);
    if (!params) {
      return;
    }
    const { network, address } = params;

    const rpcUrl = `https://${network}.g.alchemy.com/v2/${alchemyApiKey.value()}`;

    const web3 = new Web3(rpcUrl);

    const stablePoolContract = new web3.eth.Contract(stablePoolAbi, address);

    const [vaultAddress, immutableData, dynamicData] = (
      await Promise.all([
        stablePoolContract.methods.getVault().call(),
        stablePoolContract.methods.getStablePoolImmutableData().call(),
        stablePoolContract.methods.getStablePoolDynamicData().call(),
      ])
    ).map((obj) => convertBigIntToNumber(obj)) as [
      string,
      { tokens: string[]; amplificationParameterPrecision: number },
      {
        balancesLiveScaled18: number[];
        amplificationParameter: number;
        staticSwapFeePercentage: number;
      }
    ];

    const numberOfTokens = immutableData.tokens.length;
    const balances = dynamicData.balancesLiveScaled18;
    const amplificationParameter =
      dynamicData.amplificationParameter /
      immutableData.amplificationParameterPrecision;
    const staticSwapFeePercentage = dynamicData.staticSwapFeePercentage;

    const tokenNames = (await Promise.all(
      immutableData.tokens.map(async (tokenAddress) => {
        const erc20Contract = new web3.eth.Contract(erc20Abi, tokenAddress);
        return erc20Contract.methods.symbol().call();
      })
    )) as string[];

    const vaultExtensionContract = new web3.eth.Contract(
      vaultExtensionAbi,
      vaultAddress
    );

    const { hooksContract: hooksAddress } =
      (await vaultExtensionContract.methods.getHooksConfig(address).call()) as {
        hooksContract: string;
      };

    const stableSurgeContract = new web3.eth.Contract(
      stableSurgeAbi,
      hooksAddress
    );

    const [maxSurgeFeePercentage, surgeThreshold] = (
      await Promise.all([
        stableSurgeContract.methods.getMaxSurgeFeePercentage(address).call(),
        stableSurgeContract.methods.getSurgeThresholdPercentage(address).call(),
      ])
    ).map((obj) => convertBigIntToNumber(obj)) as [number, number];

    // Send the JSON response
    response.json({
      numberOfTokens,
      tokenNames,
      balances,
      amplificationParameter,
      staticSwapFeePercentage,
      maxSurgeFeePercentage,
      surgeThreshold,
    });
  })
);
