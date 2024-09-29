import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { readFileSync } from "fs";

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

let prikey = readFileSync("private_key")
let prikey2 = decodeSuiPrivateKey(prikey.toString())
let keypair = Ed25519Keypair.fromSecretKey(prikey2.secretKey)
let addr = keypair.toSuiAddress()
log(addr)
