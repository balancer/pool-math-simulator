import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineString } from "firebase-functions/params";
import { Web3 } from "web3";
import { reclammAbi } from "./reclammAbi";

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

    // Construct the response object
    // const responseData = {
    //   network,
    //   address,
    //   apiKey: apiKey.value(),
    // };

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
