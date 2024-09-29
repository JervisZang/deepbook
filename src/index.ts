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
    // let r = await deepbook_client.getLevel2TicksFromMid(poolKey, 1)
    // log(r)
})()

/*
export const testnetPools: PoolMap = {
	DEEP_SUI: {
		address: `0x0d1b1746d220bd5ebac5231c7685480a16f1c707a46306095a4c67dc7ce4dcae`,
		baseCoin: 'DEEP',
		quoteCoin: 'SUI',
	},
	SUI_DBUSDC: {
		address: `0x520c89c6c78c566eed0ebf24f854a8c22d8fdd06a6f16ad01f108dad7f1baaea`,
		baseCoin: 'SUI',
		quoteCoin: 'DBUSDC',
	},
	DEEP_DBUSDC: {
		address: `0xee4bb0db95dc571b960354713388449f0158317e278ee8cda59ccf3dcd4b5288`,
		baseCoin: 'DEEP',
		quoteCoin: 'DBUSDC',
	},
	DBUSDT_DBUSDC: {
		address: `0x69cbb39a3821d681648469ff2a32b4872739d2294d30253ab958f85ace9e0491`,
		baseCoin: 'DBUSDT',
		quoteCoin: 'DBUSDC',
	},
};

export const mainnetPools: PoolMap = {
	DEEP_SUI: {
		address: ``,
		baseCoin: 'DEEP',
		quoteCoin: 'SUI',
	},
	SUI_USDC: {
		address: ``,
		baseCoin: 'SUI',
		quoteCoin: 'USDC',
	},
	DEEP_USDC: {
		address: ``,
		baseCoin: 'DEEP',
		quoteCoin: 'USDC',
	},
	USDT_USDC: {
		address: ``,
		baseCoin: 'USDT',
		quoteCoin: 'USDC',
	},
	WUSDC_USDC: {
		address: ``,
		baseCoin: 'WUSDC',
		quoteCoin: 'USDC',
	},
};
*/
