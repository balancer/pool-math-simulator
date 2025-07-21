import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineString } from "firebase-functions/params";
import { Web3 } from "web3";
import { reclammAbi } from "./abi/reclammAbi";
import { stablePoolAbi } from "./abi/stablePoolAbi";
import { vaultExtensionAbi } from "./abi/vaultExtensionAbi";
import { stableSurgeAbi } from "./abi/stableSurgeAbi";
import { erc20Abi } from "./abi/erc20Abi";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

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

export const reclammData = onRequest(
  { cors: true },
  async (request, response) => {
    logger.info("Received request", { query: request.query });

    // Extract network and address from the query string
    const network = request.query.network as string;
    const address = request.query.address as string;

    // Basic validation (optional but recommended)
    if (!network || !address) {
      logger.error("Missing network or address parameters", {
        query: request.query,
      });
      response
        .status(400)
        .send("Missing 'network' or 'address' query parameter.");
      return;
    }

    const apiKey = defineString("ALCHEMY_API_KEY");
    const rpcUrl = `https://${network}.g.alchemy.com/v2/${apiKey.value()}`;

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
                error,
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
  }
);

export const stableSurgeData = onRequest(
  { cors: true },
  async (request, response) => {
    logger.info("Received request", { query: request.query });

    // Extract network and address from the query string
    const network = request.query.network as string;
    const address = request.query.address as string;

    // Basic validation (optional but recommended)
    if (!network || !address) {
      logger.error("Missing network or address parameters", {
        query: request.query,
      });
      response
        .status(400)
        .send("Missing 'network' or 'address' query parameter.");
      return;
    }

    const apiKey = defineString("ALCHEMY_API_KEY");
    const rpcUrl = `https://${network}.g.alchemy.com/v2/${apiKey.value()}`;

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
  }
);
