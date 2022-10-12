# Keplr React Starter

Minimal react app example connecting to Keplr wallet and staking with a selected validator. 
This app uses [Vite](https://vitejs.dev/) under the hood (not [create-react-app](https://vitejs.dev/](https://create-react-app.dev/))).


To test this PR in action, follow these instructions:

## 1. Setup Keplr wallet and get test tokens

1. Install Keplr browser extension: https://www.keplr.app/
2. Create an account in Keplr wallet
3. Add Osmosis testnet to Keplr by going to https://faucet.osmosis.zone. There you click on **"Connect Keplr"** and approval dialog will show up. Confirm.
4. Receive testing OSMO by going to https://faucet.osmosis.zone. Paste your Osmosis address and click on **"Get Tokens"**. You can see your Osmosis wallet address when you open the Keplr extension. It starts with `osmo...`
   Within few minutes you should see 200 OSMO in your Keplr wallet when `Osmosis Testnet` is selected
5. Add Juno testnet to Keplr by going to https://test.juno.tools. There you click on "Connect Wallet" and confirmation window will show up again. Confirm.
6. Receive JUNOX (Juno's testnet token) by joining Juno's Discord: https://discord.gg/Juno
   After confirming your profile, you go to `#faucet` channel and paste the following comment (but including your Juno address) `$request juno2abf6xyq26hf8vekcxt2njddunwzszf3he3v78x`
7. A bot will confirm your request and send you transaction hash. You can check the transaction was successful here: https://testnet.explorer.chaintools.tech/juno. You should see 10 JUNOX in your Keplr wallet within few minutes (make sure Juno testnet - in Keplr called as **"Uni"**, is selected)
8. Hurray! You are ready to go! Spin up the app in browser:

## 2. Run the app in browser

- Run `yarn` to install dependencies
- Run `yarn dev` to run the app in browser

<img width="1088" alt="image" src="https://user-images.githubusercontent.com/44506010/195357030-bae81bc8-02f0-4d88-8d69-842a88099a7e.png">

---

# Other Resources

**Block explorers:**

- Osmosis testnet: https://testnet.mintscan.io/osmosis-testnet
- Juno testnet: https://testnet.explorer.chaintools.tech/juno

**Cosmos Chain Registry:**

- main-nets: https://github.com/cosmos/chain-registry
- test-nets: https://github.com/cosmos/chain-registry/tree/master/testnets

**Cosmos Directory** (here you can find some useful RPC endpoints):

- https://cosmos.directory/juno

**CosmJS Stargate** (JS library to interact with chain)

- https://www.npmjs.com/package/@cosmjs/stargate
- There is also older version CosmJS launchpad, but it support Cosmos-SDK until v 0.40 and did not work with some chains (https://www.npmjs.com/package/@cosmjs/launchpad)

**Keplr CosmJS integration guide** (but uses older launchpad version as mentioned earlier)

- https://docs.keplr.app/api/cosmjs.html
