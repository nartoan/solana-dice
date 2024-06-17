"use client";

import BetHistory from "@/components/bet-history";
import Dice from "@/components/dice";
import Header from "@/components/header";
import WalletSelection from "@/components/wallet-selection";
import Container from "@/components/container";
import RollHistories from "@/components/roll-histories";
import Bet from "@/components/bet";
import { BET_BIG, BET_SMALL } from "@/const";
import Timer from "@/components/timer";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolanaProvider } from "@/components/solana-context";
import LabelCustom from "@/components/label-custom";
import { BetDialog } from "@/components/bet-dialog";
import { useEffect, useState } from "react";

export default function Home() {
  const wallets = [new PhantomWalletAdapter()];
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      // setTimeout(() => setIsOpen(true), 5000)
    }, []);

  return (
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
                <Timer />
              </div>
              <div className="rounded-[10px] border-solid border border-[#344EAD]">
                <Dice />
              </div>
              <Bet />
            </Container>
            <LabelCustom className="mt-[30px]">Active Bets</LabelCustom>
            <Container className="mt-[20px]">
              <BetHistory typeBet={BET_BIG} />
            </Container>
            <Container className="mt-[20px]">
              <BetHistory typeBet={BET_SMALL} />
            </Container>

            <LabelCustom className="mt-[30px]">Roll History</LabelCustom>
            <RollHistories />
            <BetDialog open={isOpen} setOpen={setIsOpen} />
          </div>
        </SolanaProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}
