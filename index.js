import { TezosToolkit } from '@taquito/taquito';
import dotenv from "dotenv";
import {NetworkType} from "@airgap/beacon-sdk";
import {BeaconWallet} from "@taquito/beacon-wallet";
import { InMemorySigner } from "@taquito/signer";
import {char2Bytes} from "@taquito/utils";
// import { TezBridgeSigner } from '@taquito/tezbridge-signer';
/*
const dotenv = require("dotenv")
const {TezosToolkit, MichelCodecPacker} = require("@taquito/taquito")s
const {char2Bytes, bytes2Char} = require("@taquito/utils")
const {InMemorySigner} = require("@taquito/signer")

const {BeaconWallet} = require("@taquito/beacon-wallet")
const {NetworkType} = require("@airgap/beacon-sdk")
 */
dotenv.config()
let userAddress = process.env.WALLET_PUBLIC
let private_key = process.env.WALLET_PRIVATE
const contractAddress = "KT1APQC6Fuwx5MdEj2CC6ayvsS14qWtp4VVk";
const ipfsHash = ""
const ipfsUrl = "ipfs://" + ipfsHash

let MAINNET = "https://mainnet.api.tez.ie"
let HANGNET = 'https://hangzhounet.api.tez.ie'
let RPC_URL = MAINNET

let tezosClient = new TezosToolkit(RPC_URL);

const signer = await InMemorySigner.fromSecretKey(private_key);
tezosClient.setProvider({ signer: signer });

const contract = await tezosClient.wallet.at(contractAddress);
const op = await contract.methods.mint(char2Bytes(ipfsUrl), userAddress).send();

tezosClient.tz.getBalance(userAddress).then((balance) => console.log(`${balance.toNumber() / 1000000} ꜩ`)).catch((error) => console.log(JSON.stringify(error)));
