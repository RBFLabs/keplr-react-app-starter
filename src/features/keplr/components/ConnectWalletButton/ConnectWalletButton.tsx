import { useState } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { useKeplr } from "../../hooks";
import { chainInfos } from "../../chain-infos";

interface ConnectButtonProps extends React.HTMLProps<HTMLButtonElement> {
  chainId: string;
}

export const ConnectWalletButton = ({ chainId }: ConnectButtonProps) => {
  const { getKeplr, initKeplrAccount } = useKeplr();
  const [connecting, setConnecting] = useState(false);

  const connect = async (chainId: string) => {
    console.log("connect()");
    setConnecting(true);
    const keplr = getKeplr();

    if (!keplr) {
      console.error("Keplr not found");
      setConnecting(false);
      return;
    }

    await keplr.enable(chainId);

    if (!window.getOfflineSigner) {
      console.error("window.getOfflineSigner not found");
      setConnecting(false);
      return;
    }

    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    const chain = chainInfos.find((info) => info.chainId === chainId);

    if (!chain) {
      console.error(`chain data for chainId: ${chainId} not found`);
      setConnecting(false);
      return;
    }

    const client = await SigningStargateClient.connectWithSigner(
      chain.rpc,
      offlineSigner
    );

    initKeplrAccount(client, accounts[0].address, chainId);
    console.log("Wallet connected", {
      offlineSigner: offlineSigner,
      client: client,
      accounts: accounts,
    });

    setConnecting(false);
  };

  return (
    <button disabled={connecting} onClick={() => connect(chainId)}>
      {connecting ? "Connecting..." : `Connect Keplr to ${chainId}`}
    </button>
  );
};
