import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  FC,
} from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaContextProps {
  connection: Connection | null;
  wallet: PhantomWalletAdapter | null;
}

const SolanaContext = createContext<SolanaContextProps | undefined>(undefined);

export const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [wallet, setWallet] = useState<PhantomWalletAdapter | null>(null);

  useEffect(() => {
    const conn = new Connection(clusterApiUrl("devnet"), "confirmed");
    setConnection(conn);
  }, []);

  const walletAdapter = useMemo(() => new PhantomWalletAdapter(), []);

  useEffect(() => {
    walletAdapter.on("connect", () => {
      setWallet(walletAdapter);
    });
    walletAdapter.on("disconnect", () => {
      setWallet(null);
    });

    walletAdapter.connect();
  }, [walletAdapter]);

  return (
    <SolanaContext.Provider value={{ connection, wallet }}>
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = (): SolanaContextProps => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
};
