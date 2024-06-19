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
import { useEffect, useMemo, useState, useRef } from "react";
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
  const [betsClosed, setBetsClosed] = useState<boolean>(false);
  const [betHistories, setBetHistories] = useState<IBetHistory[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = timerRef.current.getRemainingTime();
      if (remainingTime > 10000 && remainingTime <= 15000) {
        setBetsClosed(true);
      } else if (remainingTime <= 10000) {
        // TODO: Check if there's any new roll history
        // If there's a new roll result, set the dice result and roll
        // Otherwise, roll the dice with random numbers
        setRolling(true);
      } else {
        setBetsClosed(false);
        setRolling(false);
      }
    }, 1000); // Check every second
    return () => clearInterval(interval);
    // setTimeout(() => setIsOpen(true), 5000)
  }, []);

  const handleBet = (betData: IBetHistory) => {
    setBetHistories((betHistories) => [...betHistories, betData]);
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
                  <Timer ref={timerRef}/>
                </div>
                <div className="rounded-[10px] border-solid border border-[#344EAD]">
                  <Dice rolling={rolling} />
                </div>
                <Bet rolling={rolling} betsClosed={betsClosed} bet={handleBet} />
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
