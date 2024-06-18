"use client";

import BetHistory, { IBetHistory } from "@/components/bet-history";
import Dice from "@/components/dice";
import Header from "@/components/header";
import WalletSelection from "@/components/wallet-selection";
import Container from "@/components/container";
import RollHistories from "@/components/roll-histories";
import Bet from "@/components/bet";
import { BET_BIG, BET_SMALL } from "@/const";
import Timer from "@/components/timer";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolanaProvider } from "@/components/solana-context";
import LabelCustom from "@/components/label-custom";
import { BetDialog } from "@/components/bet-dialog";
import { useEffect, useMemo, useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export default function Home() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [rolling, setRolling] = useState<boolean>(false);
  const [timeRemain, setTimeRemain] = useState<number>(60);
  const [betHistories, setDetHistories] = useState<IBetHistory[]>([]);

  useEffect(() => {
    if (timeRemain <= 10) {
      setRolling(true);
    } else {
      setRolling(false);
    }

    if (timeRemain == 0) {
      setTimeRemain(60);
      setDetHistories([]);
    }

    const timeInterval = setInterval(() => setTimeRemain(timeRemain - 1), 1000);

    return () => clearInterval(timeInterval);
  }, [timeRemain]);

  useEffect(() => {
    // setTimeout(() => setIsOpen(true), 5000)
  }, []);

  const handleBet = (betData: IBetHistory) => {
    setDetHistories((betHistories) => [...betHistories, betData]);
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <SolanaProvider>
            <div className="w-full max-w-xl">
              <Header />
              <WalletSelection />
              <div
                className={`bg-[#0B0B1F] h-[130px] flex justify-center items-center text-center mt-[20px] text-[32px] leading-none`}
              >
                <LabelCustom className="max-w-[250px]">
                  Big & Small Dice
                </LabelCustom>
              </div>
              <Container className={`flex flex-col mt-5 gap-[20px]`}>
                <div className="flex justify-between">
                  <span className="text-[10px]">
                    Time left until the next game:
                  </span>
                  <Timer timeRemain={timeRemain} />
                </div>
                <div className="rounded-[10px] border-solid border border-[#344EAD]">
                  <Dice rolling={rolling} />
                </div>
                <Bet rolling={rolling} bet={handleBet} />
              </Container>
              <LabelCustom classNameContainer="mt-[30px]">
                Active Bets
              </LabelCustom>
              <Container className="mt-[20px]">
                <BetHistory typeBet={BET_BIG} betHistories={betHistories} />
              </Container>
              <Container className="mt-[20px]">
                <BetHistory typeBet={BET_SMALL} betHistories={betHistories} />
              </Container>

              <LabelCustom classNameContainer="mt-[30px]">
                Roll History
              </LabelCustom>
              <RollHistories />
              <BetDialog open={isOpen} setOpen={setIsOpen} />
            </div>
          </SolanaProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
