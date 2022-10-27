import { useState, useEffect } from "react";
import {
  GasPrice,
  createProtobufRpcClient,
  QueryClient,
  calculateFee,
} from "@cosmjs/stargate";
import {
  MsgExec,
  MsgGrant,
  MsgRevoke,
} from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import {
  StakeAuthorization,
  AuthorizationType,
} from "cosmjs-types/cosmos/staking/v1beta1/authz";
import { QueryClientImpl } from "cosmjs-types/cosmos/authz/v1beta1/query";
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

import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

export const AuthzForm = () => {
  const [chainId, setChainId] = useState("uni-5");
  const { keplrAccount } = useKeplr();

  const grant = async (grantee: string) => {
    const { account, chain, client } = keplrAccount;

    const grantedMsg = "/cosmos.staking.v1beta1.MsgDelegate";
    const grant = {
      authorization: {
        typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization",
        value: StakeAuthorization.encode(
          StakeAuthorization.fromPartial({
            authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
            allowList: { address: junoTestValidators },
          })
        ).finish(),
      },
      expiration: { seconds: Date.now() / 1000 + 1 * 60 * 60 * 24 * 360 },
    };
    const msgType = MsgGrant.fromPartial({
      granter: account.address,
      grantee,
      grant,
    });

    const txmsg = {
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: msgType,
    };
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

  const check = async () => {
    const tendermint = await Tendermint34Client.connect(
      "https://juno-testnet-rpc.polkachu.com"
    );
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);
    const response = await queryService.Grants({
      granter: "juno1rqd9n0uauj32382vn9nme634zhvxv0a743gl6x",
      grantee: "juno1gt785khla47kfdx5s3zr320ysune0kqkvsd8v6",
      msgTypeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    });
    console.log(response);
  };

  const make = async (grantee: string) => {
    const { account, chain, client } = keplrAccount;
    const msgDelegateType = MsgDelegate.fromPartial({
      delegatorAddress: "juno1rqd9n0uauj32382vn9nme634zhvxv0a743gl6x",
      validatorAddress: "junovaloper19yltltjed5688sullftzurhdshmjwtm8kvf67t",
      amount: { denom: "ujunox", amount: "1" },
    });

    const msgDelegate = Any.fromPartial({
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: MsgDelegate.encode(msgDelegateType).finish(),
    });

    const msgExecType = MsgExec.fromPartial({ grantee, msgs: [msgDelegate] });

    const txmsg = {
      typeUrl: "/cosmos.authz.v1beta1.MsgExec",
      value: msgExecType,
    };

    alert(JSON.stringify(txmsg));
    const gasPrice = GasPrice.fromString(
      `0.002${chain.stakeCurrency.coinMinimalDenom}`
    );
    const txFee = calculateFee(300000, gasPrice);
    const result = await client.signAndBroadcast(
      account.address,
      [txmsg],
      txFee,
      "msgExec"
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
        <>
          <button
            onClick={() => grant("juno1gt785khla47kfdx5s3zr320ysune0kqkvsd8v6")}
            disabled={false}
          >
            Grant
          </button>
          <button onClick={() => check()} disabled={false}>
            Check
          </button>
          <button
            onClick={() => make("juno1gt785khla47kfdx5s3zr320ysune0kqkvsd8v6")}
            disabled={false}
          >
            Make
          </button>
        </>
      )}
    </div>
  );
};
