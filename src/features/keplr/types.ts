import type { SigningStargateClient } from "@cosmjs/stargate";
import type { Window as KeplrWindow, Keplr } from "@keplr-wallet/types";
import type { ChainInfo } from "./chain-infos";

declare global {
  interface Window extends KeplrWindow {}
}

export interface AccountData {
  address: string;
}

export interface KeplrAccount {
  chain: ChainInfo;
  account: AccountData;
  client: SigningStargateClient;
}

export interface KeplrContextProps {
  keplrAccount: KeplrAccount | undefined;
  extensionNotInstalled: boolean;
  getKeplr(): Keplr | undefined;
  initKeplrAccount: (
    client: SigningStargateClient,
    accountAddress: string,
    chainId: string
  ) => void;
  clearLastUsedKeplr(): void;
  connectionType?: "extension"; // Eventually later add connection via mobile wallet,
  setDefaultConnectionType(type: "extension" | undefined): void;
}
