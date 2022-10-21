import { useState, useEffect } from "react";
import { GasPrice, coins, calculateFee } from "@cosmjs/stargate";
import {
  MsgExec,
  MsgGrant,
  MsgRevoke,
} from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { Any } from "cosmjs-types/google/protobuf/any.js";
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";
import { useKeplr } from "../../hooks";
import { getExplorerLink } from "../../utils";
import {
  chainInfos,
  junoTestValidators,
  osmosisTestValidators,
} from "../../chain-infos";
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";

interface Validators {
  [chainId: string]: string[];
}

const validators: Validators = {
  "uni-5": junoTestValidators,
  "osmo-test-4": osmosisTestValidators,
};

export const StakeForm = () => {
  const [chainId, setChainId] = useState("uni-5");
  const [selectedValidator, setSelectedValidator] = useState(
    validators[chainId][0]
  );
  const [stakeAmount, setStakeAmount] = useState("");
  const [error, setError] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [sending, setSending] = useState(false);
  const [userBalance, setUserBalance] = useState<number>();
  const { keplrAccount } = useKeplr();

  const grant = async (grantee: string) => {
    const { account, chain, client } = keplrAccount;
    const msgType = MsgGrant.fromPartial({ grantee });
    const msgBytes = MsgGrant.encode(msgType).finish();
    const txmsg = Any.fromPartial({
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: msgBytes,
    });
    const gasPrice = GasPrice.fromString(
      `0.002${chain.stakeCurrency.coinMinimalDenom}`
    );
    const txFee = calculateFee(300000, gasPrice);
    const result = await client.signAndBroadcast(
      account.address,
      [txmsg],
      txFee,
      "grant"
    );
    assertIsDeliverTxSuccess(result);
  };

  const clearTxData = () => {
    setError(false);
    setTxHash("");
  };

  const onChainChange = (chainId: string) => {
    clearTxData();
    setChainId(chainId);
    setSelectedValidator(validators[chainId][0]);
  };

  const onValidatorChange = (validatorAddress: string) => {
    clearTxData();
    setSelectedValidator(validatorAddress);
  };

  const updateUserBalance = async (
    client: SigningStargateClient,
    address: string,
    currencyDenom: string,
    coinDecimals: number
  ) => {
    const balance = await client.getBalance(address, currencyDenom);
    const realBalance = Number(balance.amount) / 10 ** coinDecimals;
    setUserBalance(realBalance);
  };

  useEffect(() => {
    const getUserBalance = async () => {
      if (keplrAccount && keplrAccount.chain.stakeCurrency) {
        const { client } = keplrAccount;
        const { address } = keplrAccount.account;
        const { coinMinimalDenom, coinDecimals } =
          keplrAccount.chain.stakeCurrency;
        updateUserBalance(client, address, coinMinimalDenom, coinDecimals);
      }
    };
    // TODO somehow listen on user balance so that the value updates on balance change. Not only on component load
    // (Or update user balance when tx is sent successfully)
    getUserBalance();
  }, [keplrAccount]);

  const delegate = async () => {
    console.log("delegate()");
    if (!keplrAccount) {
      alert("No Keplr account");
      return;
    }
    setSending(true);
    clearTxData();

    const { account, chain, client } = keplrAccount;
    const stakeCurrency = chain.stakeCurrency;
    const delegatorAddress = account.address;
    const amount = coins(
      Number(stakeAmount) * 10 ** stakeCurrency.coinDecimals,
      stakeCurrency.coinMinimalDenom
    );
    const memo = "custom memo message";
    const gasPrice = GasPrice.fromString(
      `0.002${stakeCurrency.coinMinimalDenom}`
    );
    const txFee = calculateFee(300000, gasPrice);

    // sign and broadcast tx
    try {
      const resp = await client.delegateTokens(
        delegatorAddress,
        selectedValidator,
        amount[0],
        txFee,
        memo
      );
      if (resp.code === 0) {
        // code === 0 => success
        setTxHash(resp.transactionHash);
        setStakeAmount("");
      } else {
        setError(true);
        console.error("Transaction not sent", resp);
      }
    } catch (error) {
      setError(true);
      console.error(error);
    }
    setSending(false);
  };

  const chain = keplrAccount?.chain;
  const account = keplrAccount?.account;
  const chainIdMismatch = chainId !== keplrAccount?.chain.chainId;
  const dataMismatch = !keplrAccount || !chain || !account || chainIdMismatch;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", textAlign: "left" }}
    >
      <h3>Select chain and validator you want to delegate your tokens</h3>
      <select value={chainId} onChange={(e) => onChainChange(e.target.value)}>
        {chainInfos.map((info) => (
          <option key={info.chainId} value={info.chainId}>
            {info.chainName}
          </option>
        ))}
      </select>
      <br />
      <select
        value={selectedValidator}
        onChange={(e) => onValidatorChange(e.target.value)}
      >
        {validators[chainId].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      <br />
      <h3>Transaction data</h3>
      <ul style={{ marginTop: 0 }}>
        <li>Chain ID: {dataMismatch ? "-" : chain.chainId}</li>
        <li>RPC: {dataMismatch ? "-" : chain.rpc}</li>
        <li>Validator: {dataMismatch ? "-" : selectedValidator}</li>
        <li>Sender address: {dataMismatch ? "-" : account.address}</li>
        <li>
          Your balance:
          {chain && userBalance && !dataMismatch
            ? ` ${userBalance} ${chain.stakeCurrency.coinDenom}`
            : "-"}
        </li>
      </ul>
      {chain && (
        <>
          <input
            placeholder={`Amount of ${chain.stakeCurrency.coinDenom} to stake`}
            value={stakeAmount}
            onChange={(event) => setStakeAmount(event.currentTarget.value)}
          />
          <br />
        </>
      )}

      {dataMismatch ? (
        // show connect button if Keplr not connected or chain-id of selected and connected chain are different
        <ConnectWalletButton chainId={chainId} />
      ) : (
        <button onClick={delegate} disabled={sending}>
          Stake
        </button>
      )}

      <br />

      <div style={{ textAlign: "center" }}>
        {sending && <span>Sending...</span>}
        {error && (
          <div>
            <b>Error... :(</b>
            <div>Check console for details</div>
          </div>
        )}
        {txHash && (
          <div>
            <b>Success!</b>
            <div>
              Tx. hash:{" "}
              {keplrAccount?.chain.explorerUrlToTx ? (
                <a
                  href={`${getExplorerLink(
                    keplrAccount?.chain.explorerUrlToTx,
                    txHash
                  )}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {txHash}
                </a>
              ) : (
                txHash
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
