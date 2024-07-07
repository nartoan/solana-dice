import React, { ReactNode, useMemo, FC } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import "@solana/wallet-adapter-react-ui/styles.css";
import { SOLANA_NETWORK } from "@/const";
import dynamic from "next/dynamic";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => "https://alpha-quick-wildflower.solana-mainnet.quiknode.pro/8c0a1fc4f519a25679270612b14f7f3839fd07da/"/*clusterApiUrl(SOLANA_NETWORK)*/, []);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};
