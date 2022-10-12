interface Currency {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
}

export interface ChainInfo {
  rpc: string;
  rest: string;
  chainId: string;
  chainName: string;
  stakeCurrency: Currency;
  gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
  explorerUrlToTx: string;
}

const IS_TESTNET = true;

// Found config values here:
// 1. Osmosis frontend: https://github.com/osmosis-labs/osmosis-frontend/blob/master/packages/web/config/chain-infos.ts
// 2. Chain Registry main-nets: https://github.com/cosmos/chain-registry
// 3. Chain Registry test-nets: https://github.com/cosmos/chain-registry/tree/master/testnets
export const chainInfos: ChainInfo[] = [
  {
    rpc: IS_TESTNET
      ? "https://rpc-test.osmosis.zone/"
      : "https://rpc-osmosis.keplr.app/",
    rest: IS_TESTNET
      ? "https://lcd-test.osmosis.zone/"
      : "https://lcd-osmosis.keplr.app/",
    chainId: IS_TESTNET ? "osmo-test-4" : "osmosis-1",
    chainName: "Osmosis",
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
    },
    gasPriceStep: {
      low: 0,
      average: 0,
      high: 0.025,
    },
    explorerUrlToTx: IS_TESTNET
      ? "https://testnet.mintscan.io/osmosis-testnet/txs/{txHash}"
      : "https://www.mintscan.io/osmosis/txs/{txHash}",
  },
  {
    rpc: IS_TESTNET
      ? "https://juno-testnet-rpc.polkachu.com/"
      : "https://rpc-juno.keplr.app",
    rest: IS_TESTNET
      ? "https://api.uni.junonetwork.io"
      : "https://lcd-juno.keplr.app",
    chainId: IS_TESTNET ? "uni-5" : "juno-1",
    chainName: IS_TESTNET ? "Juno Testnet" : "Juno",
    stakeCurrency: {
      coinDenom: IS_TESTNET ? "JUNOX" : "JUNO",
      coinMinimalDenom: IS_TESTNET ? "ujunox" : "ujuno",
      coinDecimals: 6,
    },
    gasPriceStep: {
      low: 0.03,
      average: 0.04,
      high: 0.05,
    },
    explorerUrlToTx: IS_TESTNET
      ? "https://testnet.explorer.chaintools.tech/juno/tx/{txHash}"
      : "https://www.mintscan.io/juno/txs/{txHash}",
  },
];

// more validators on Juno testnet can be found here: https://testnet.explorer.chaintools.tech/juno/staking
export const junoTestValidators = [
  "junovaloper19yltltjed5688sullftzurhdshmjwtm8kvf67t",
  "junovaloper1t30jjapppmrjeky60sxeeakgqzlkaqk8xn4h05",
  "junovaloper1vcx3qmak2prfe3ljn6uu55xznl6smrksqmcatz",
  "junovaloper18wgy6hy6yv3fvevl5pyfn7cvzx3t5use2vssnf",
];

// more validators on Osmosis testnet can be found
// Here: https://testnet.mintscan.io/osmosis-testnet/validators
// Or here: https://testnet.keplr.app/chains/osmosis
export const osmosisTestValidators = [
  "osmovaloper1c584m4lq25h83yp6ag8hh4htjr92d954kphp96",
  "osmovaloper19aeq7hpscdftvrquf3ccs98z9d5q9r4xhy0a9y",
  "osmovaloper1l0ta4rw7zauqplzhsvcsgxveuqptauf6e4eg7a",
  "osmovaloper1p6jgt7rvqe38ccckrzylg20uw4mhptp5fyj45e",
];

