import { useEffect, useState, useCallback, useRef } from "react";
import { chainInfos } from "./chain-infos";
import { KeplrContext } from "./KeplrContext";
import type { Keplr } from "@keplr-wallet/types";
import type { SigningStargateClient } from "@cosmjs/stargate";
import type { KeplrAccount } from "./types";

export interface KeplrProviderProps {
  children: React.ReactNode;
}

export function KeplrProvider({ children }: KeplrProviderProps) {
  const [extensionNotInstalled, setExtensionNotInstalled] = useState(false);
  const [account, setAccount] = useState<KeplrAccount>();
  const lastUsedKeplrRef = useRef<Keplr | undefined>();
  const defaultConnectionTypeRef = useRef<"extension" | undefined>();
  const [connectionType, setConnectionType] = useState<
    "extension" | undefined
  >();

  const getKeplr = useCallback(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (lastUsedKeplrRef.current) {
      return lastUsedKeplrRef.current;
    }

    if (window.keplr) {
      lastUsedKeplrRef.current = window.keplr;
      return window.keplr;
    }

    return undefined;
  }, []);

  const initKeplrAccount = (
    client: SigningStargateClient,
    accountAddress: string,
    chainId: string
  ) => {
    const chain = chainInfos.find((info) => info.chainId === chainId);

    if (!chain) {
      console.warn(`Unknown chainId: ${chainId}`);
      return;
    }

    if (!accountAddress) {
      console.warn(`No Keplr account provided`);
      return;
    }

    if (!client) {
      console.warn(`Keplr client not specified`);
      return;
    }

    setAccount({ client, account: { address: accountAddress }, chain });
  };

  useEffect(() => {
    if (!window.keplr) {
      setExtensionNotInstalled(true);
    }
  }, []);

  return (
    <KeplrContext.Provider
      value={{
        getKeplr,
        initKeplrAccount,
        keplrAccount: account,
        extensionNotInstalled,
        clearLastUsedKeplr: useCallback(() => {
          lastUsedKeplrRef.current = undefined;
          setConnectionType(undefined);
        }, []),
        setDefaultConnectionType: useCallback(
          (type: "extension" | undefined) => {
            defaultConnectionTypeRef.current = type;
          },
          []
        ),
        connectionType,
      }}
    >
      {children}
    </KeplrContext.Provider>
  );
}
