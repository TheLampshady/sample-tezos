import dotenv from "dotenv"
import { TezosToolkit, MichelCodecPacker } from "@taquito/taquito";
import { char2Bytes, bytes2Char } from "@taquito/utils";
import { NetworkType } from "@airgasp/beacon-sdk";

dotenv.config()
if (process.argv.length < 3) throw "ipfs hash required"
const args = process.argv.slice(2)
const ipfsHash = args[0]

const contractAddress = "KT1APQC6Fuwx5MdEj2CC6ayvsS14qWtp4VVk";
const userAddress = process.env.WALLET_PUBLIC

// RPC Nodes
// https://tezostaquito.io/docs/rpc_nodes/
const MAINNET = "https://mainnet.api.tez.ie"
const RPC_URL = MAINNET + ""

const permissionOptions = {
  network: {
    type: NetworkType.MAINNET,
    RPC_URL
  }
}

const tezosClient = new TezosToolkit(RPC_URL);
let wallet
const walletOptions = {
  name: "Illic et Numquam",
  preferredNetwork: NetworkType.MAINNET
};

async function getUserNfts() {
  const contract = await tezosClient.wallet.at(contractAddress);
  const nftStorage = await contract.storage();
  const getTokenIds = await nftStorage.reverse_ledger.get(address);
  let userNfts = []
  if (getTokenIds) {
    userNfts = await Promise.all([
      ...getTokenIds.map(async id => {
        const tokenId = id.toNumber();
        const metadata = await nftStorage.token_metadata.get(tokenId);
        const tokenInfoBytes = metadata.token_info.get("");
        const tokenInfo = bytes2Char(tokenInfoBytes);
        return {
          tokenId,
          ipfsHash:
            tokenInfo.slice(0, 7) === "ipfs://" ? tokenInfo.slice(7) : null
        }
      })
    ])
  }
  return userNfts
}


async function mintNfts() {
  const contract = await tezosClient.wallet.at(contractAddress);
  const op = await contract.methods
    .mint(char2Bytes("ipfs://" + ipfsHash), userAddress)
    .send();
  console.log("Op hash:", op.opHash);
  await op.confirmation();
  return op.opHash
}

async function connect() {

}
