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

    const priceRange = convertBigIntToNumber(
      await contract.methods.computeCurrentPriceRange().call()
    );
    const virtualBalances = convertBigIntToNumber(
      await contract.methods.computeCurrentVirtualBalances().call()
    );
    const realBalances = convertBigIntToNumber(
      await contract.methods.getCurrentLiveBalances().call()
    );
    const dailyPriceShiftExponent = convertBigIntToNumber(
      await contract.methods.getDailyPriceShiftExponent().call()
    );
    const centerednessMargin = convertBigIntToNumber(
      await contract.methods.getCenterednessMargin().call()
    );

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
