import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { readFileSync } from "fs";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
// import { DeepBookClient } from "@mysten/deepbook-v3";
import { Environment } from "@mysten/deepbook-v3/dist/cjs/types";
import { DeepBookClient  } from "@mysten/deepbook"

export function log(...optionalParams: any[]) {
    function getCallerInfo(): string {
        const stack = new Error().stack;
        if (!stack) {
            return '';
        }
        const stackLines = stack.split('\n');
        const callerLine = stackLines[3]; // Adjust index if needed based on your environment
        // const idx = callerLine.lastIndexOf("/", callerLine.lastIndexOf("/") - 1)
        const idx = callerLine.lastIndexOf("/")
        return callerLine.substring(idx);
    }
    console.log(getCallerInfo(), ...optionalParams);
}

const sui = "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN";
const usdc_wormhole = "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN";

// deepbook v3 还没上主网
(async () => {
    let prikey = readFileSync("private_key")
    let prikey2 = decodeSuiPrivateKey(prikey.toString())
    let keypair = Ed25519Keypair.fromSecretKey(prikey2.secretKey)
    let addr = keypair.toSuiAddress()
    log(addr)
    let env = 'mainnet' as Environment
    let suiclient = new SuiClient({url: getFullnodeUrl(env)})
    let deepbook_client = new DeepBookClient(
        suiclient,
        addr,
        addr,
        // env: env,
    );
    // let poolId = await deepbook_client.getPoolIdByAssets(sui, usdc_wormhole)
    let poolKey = "0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33"
    let poolInfo = await deepbook_client.getPoolInfo(poolKey)
    log(poolInfo)
    let pools = await deepbook_client.getAllPools({limit: 100})
    log("allPools len", pools.data.length)
    
    const marketPrice = await deepbook_client.getMarketPrice(poolKey)
    log("Market Price:", marketPrice)

    // Define the percentage range (e.g., 5%)
    const percentageRange = 5n
    
    if (marketPrice.bestBidPrice && marketPrice.bestAskPrice) {
        // Calculate lower and upper bounds
        const lowerPrice = marketPrice.bestBidPrice * (100n - percentageRange) / 100n
        const upperPrice = marketPrice.bestAskPrice * (100n + percentageRange) / 100n

        let bookStatus = await deepbook_client.getLevel2BookStatus(poolKey, lowerPrice, upperPrice, "both");
        log("Book Status:", bookStatus);
    } else {
        log("Unable to calculate price range: Best bid or ask price is undefined");
    }
})()
