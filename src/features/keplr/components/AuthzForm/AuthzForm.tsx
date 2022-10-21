import { useState, useEffect } from "react";
import { GasPrice, coins, calculateFee } from "@cosmjs/stargate";
import {
  MsgExec,
  MsgGrant,
  MsgRevoke,
} from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
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

export const AuthzForm = () => {
  const [chainId, setChainId] = useState("uni-5");
  const { keplrAccount } = useKeplr();

  const grant = async (grantee: string) => {
    const { account, chain, client } = keplrAccount;

    const grantedMsg =
      "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
    const grant = {
      authorization: {
        typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
        value: GenericAuthorization.encode(
          GenericAuthorization.fromPartial({
            msg: grantedMsg,
          })
        ).finish(),
      },
    };
    const msgType = MsgGrant.fromPartial({
      granter: account.address,
      grantee,
      grant,
    });
    alert(JSON.stringify(msgType));
    //const msgBytes = MsgGrant.encode(msgType).finish();

    const txmsg = Any.fromPartial({
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: msgType,
    });
    alert(JSON.stringify(txmsg));
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

  const chain = keplrAccount?.chain;
  const account = keplrAccount?.account;
  const chainIdMismatch = chainId !== keplrAccount?.chain.chainId;
  const dataMismatch = !keplrAccount || !chain || !account || chainIdMismatch;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", textAlign: "left" }}
    >
      {dataMismatch ? (
        // show connect button if Keplr not connected or chain-id of selected and connected chain are different
        <ConnectWalletButton chainId={chainId} />
      ) : (
        <button
          onClick={() => grant("juno1cuf7xyq98hf8vekcxt2njxxunwzszf3he3v55r")}
          disabled={false}
        >
          Grant
        </button>
      )}
    </div>
  );
};
