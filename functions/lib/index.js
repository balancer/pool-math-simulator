"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reclammData = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const params_1 = require("firebase-functions/params");
const web3_1 = require("web3");
const reclammAbi_1 = require("./reclammAbi");
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
function convertBigIntToNumber(obj) {
    if (typeof obj === "bigint") {
        return Number(obj);
    }
    else if (Array.isArray(obj)) {
        return obj.map(convertBigIntToNumber);
    }
    else if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, convertBigIntToNumber(v)]));
    }
    return obj;
}
exports.reclammData = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    logger.info("Received request", { query: request.query });
    // Extract network and address from the query string
    const network = request.query.network;
    const address = request.query.address;
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
    const apiKey = (0, params_1.defineString)("ALCHEMY_API_KEY");
    const rpcUrl = `https://${network}.g.alchemy.com/v2/${apiKey.value()}`;
    const web3 = new web3_1.Web3(rpcUrl);
    const contract = new web3.eth.Contract(reclammAbi_1.reclammAbi, address);
    const [priceRange, virtualBalances, realBalances, dailyPriceShiftExponent, centerednessMargin,] = (await Promise.all([
        contract.methods.computeCurrentPriceRange().call(),
        contract.methods.computeCurrentVirtualBalances().call(),
        contract.methods.getCurrentLiveBalances().call(),
        contract.methods.getDailyPriceShiftExponent().call(),
        contract.methods.getCenterednessMargin().call(),
    ])).map((obj) => convertBigIntToNumber(obj));
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
});
//# sourceMappingURL=index.js.map