import { TezosToolkit } from '@taquito/taquito';
import dotenv from "dotenv";
import {NetworkType} from "@airgap/beacon-sdk";
import {BeaconWallet} from "@taquito/beacon-wallet";
import { InMemorySigner } from "@taquito/signer";
import {char2Bytes} from "@taquito/utils";
// import { TezBridgeSigner } from '@taquito/tezbridge-signer';
/*
const dotenv = require("dotenv")
const {TezosToolkit, MichelCodecPacker} = require("@taquito/taquito")
const {char2Bytes, bytes2Char} = require("@taquito/utils")
const {InMemorySigner} = require("@taquito/signer")

const {BeaconWallet} = require("@taquito/beacon-wallet")
const {NetworkType} = require("@airgap/beacon-sdk")
 */
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
