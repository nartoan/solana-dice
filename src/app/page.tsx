"use client";
import { Silkscreen as FontSans } from "next/font/google";

import BetHistory from "@/components/bet-history";
import Dice from "@/components/dice";
import Header from "@/components/header";
import WalletSelection from "@/components/wallet-selection";
import Container from "@/components/container";
import RollHistories from "@/components/roll-histories";
import Bet from "@/components/bet";
import { BET_BIG, BET_SMALL } from "@/const";
import Timer from "@/components/timer";

const fontSans = FontSans({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  return (
    <div className="w-full max-w-xl">
      <Header />
      <WalletSelection />
      <div
        className={`bg-[#0B0B1F] h-[130px] flex justify-center items-center text-center mt-[20px] text-[40px] leading-none ${fontSans.className}`}
      >
        <span className="max-w-[300px]">Big & Small Dice</span>
      </div>
      <Container className={`flex flex-col mt-5 gap-[20px]`}>
        <div className="flex justify-between">
          <span className="text-[10px]">Time left until the next game:</span>
          <Timer />
        </div>
        <div className="rounded-[10px] border-solid border border-[#344EAD]">
          <Dice />
        </div>
        <Bet />
      </Container>
      <p className={`mt-[30px] ${fontSans.className}`}>Active Bets</p>
      <Container className="mt-[20px]">
        <BetHistory typeBet={BET_BIG} />
      </Container>
      <Container className="mt-[20px]">
        <BetHistory typeBet={BET_SMALL} />
      </Container>

      <p className={`mt-[30px] ${fontSans.className}`}>Roll History</p>
      <RollHistories />
    </div>
  );
}
