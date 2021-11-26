# Overview
Minting images for Tezos

# Minting Service
[RPC Noes](https://tezostaquito.io/docs/rpc_nodes/#list-of-community-run-nodes)


# Tezster
npm install -g tezster@latest

# Tezos Client CLI

* [MAC install](https://assets.tqtezos.com/docs/ssetup/1-tezos-client/)
* [How To](https://tezos.gitlab.io/introduction/howtouse.html)
* [Importing Wallets](https://medium.com/@csoreff/getting-started-with-the-tezos-command-line-client-on-betanet-macos-484d16be4612)

```bash
tezos-client --endpoint https://mainnet.api.tez.ie config update
```

```bash
tezos-client add address my_account <public key>
tezos-client get balance for my_account
tezos-client import fundraiser secret key my_account
```
