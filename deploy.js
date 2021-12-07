import { TezosToolkit } from '@taquito/taquito';
import dotenv from "dotenv";
import { InMemorySigner } from "@taquito/signer";

dotenv.config()
if (process.argv.length < 3) throw "ipfs hash required"
const args = process.argv.slice(2)
const ipfsHash = args[0]
let userAddress = process.env.WALLET_PUBLIC
let private_key = process.env.WALLET_PRIVATE

let MAINNET = "https://mainnet.api.tez.ie"
let MAINNET_SMARTPY = "https://mainnet.smartpy.io/chains/main/blocks/head/header"
let HANGNET = 'https://hangzhounet.api.tez.ie'
let RPC_URL = MAINNET_SMARTPY

async function deploy() {
  let tezosClient = new TezosToolkit(RPC_URL);
  const signer = await InMemorySigner.fromSecretKey(private_key);
  tezosClient.setProvider({ signer: signer });

  try {
    const { hash, contractAddress } = await tezosClient.contract.originate({
      code: require("../build/counter.json"),
      init: require("../build/counter_storage.json"),
    });

    console.log("Successfully deployed contract");
    console.log(`>> Transaction hash: ${hash}`);
    console.log(`>> Contract address: ${contractAddress}`);
  } catch (error) {
    console.log(error);
  }
};

deploy();
