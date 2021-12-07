import { TezosToolkit } from '@taquito/taquito';
import dotenv from "dotenv";
import { InMemorySigner } from "@taquito/signer";
import {char2Bytes} from "@taquito/utils";

dotenv.config()
if (process.argv.length < 3) throw "ipfs hash required"
const args = process.argv.slice(2)
const ipfsHash = args[0]
// const ipfsHash ="Qmbip6vk75VKdEkneAKZYyr6R79y5n38p2oRup3w8L1M7K"
let userAddress = process.env.WALLET_PUBLIC
let private_key = process.env.WALLET_PRIVATE
const contractAddress = "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"
const ipfsUrl = "ipfs://" + ipfsHash

let MAINNET = "https://mainnet.api.tez.ie"
let MAINNET_SMARTPY = "https://mainnet.smartpy.io/chains/main/blocks/head/header"
let HANGNET = 'https://hangzhounet.api.tez.ie'
let RPC_URL = MAINNET_SMARTPY

let tezosClient = new TezosToolkit(RPC_URL);

const signer = await InMemorySigner.fromSecretKey(private_key);
tezosClient.setProvider({ signer: signer });

try {
const contract = await tezosClient.wallet.at(contractAddress);
const op = await contract.methods.mint(char2Bytes(ipfsUrl), userAddress).send();
} catch (e) {
  console.log(e)
}
