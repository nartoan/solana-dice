"use client";
import { Silkscreen as FontSans } from "next/font/google";
import { useState } from "react";

import BetButton from "@/components/BetButton";
import BetHistory from "@/components/BetHistory";
import Dice from "@/components/Dice";
import Header from "@/components/Header";
import PriceBet from "@/components/PriceBet";
import WalletSelection from "@/components/WalletSelection";
import { Badge } from "@/components/ui/badge";
import { IBetType } from "@/types/bet";
import { BET_TYPE } from "@/const";
import Container from "@/components/Container";
import RollHistory from "@/components/RollHistory";

const fontSans = FontSans({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const [selectedPrice, setSelectedPrice] = useState<number>(0.1);
  const [bet, setBet] = useState<IBetType | undefined>();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-5xl">
        <Header />
        <WalletSelection />
        <div
          className={`bg-[#0B0B1F] h-[130px] flex justify-center items-center text-center mt-[20px] text-[40px] leading-none ${fontSans.className}`}
        >
          Big & Small Dice
        </div>
        <Container className={`flex flex-col mt-5 gap-[20px]`}>
          <div className="flex justify-between">
            <span className="text-[10px]">Time left until the next game:</span>
            <span className="w-[92px] h-[20px] bg-primary flex justify-center items-center text-[12px] rounded-sm font-bold">
              00:56
            </span>
          </div>
          <div className="rounded-[10px] border-solid border border-[#344EAD]">
            <Dice />
          </div>
          <div className="flex justify-around items-center">
            <PriceBet
              price={0.1}
              selectedPrice={selectedPrice}
              onClick={setSelectedPrice}
            />
            <PriceBet
              price={0.3}
              selectedPrice={selectedPrice}
              onClick={setSelectedPrice}
            />
            <PriceBet
              price={0.5}
              selectedPrice={selectedPrice}
              onClick={setSelectedPrice}
            />
            <PriceBet
              price={0.7}
              selectedPrice={selectedPrice}
              onClick={setSelectedPrice}
            />
            <PriceBet
              price={1.0}
              selectedPrice={selectedPrice}
              onClick={setSelectedPrice}
            />
          </div>
          <div className="flex justify-around items-center gap-[20px]">
            <BetButton bet="small" selectedBet={bet} onClick={setBet} />
            <BetButton bet="big" selectedBet={bet} onClick={setBet} />
          </div>
        </Container>
        <p className={`mt-[30px] ${fontSans.className}`}>Active Bets</p>
        <Container className="mt-[20px]">
          <BetHistory typeBet={BET_TYPE.BIG as IBetType} />
        </Container>
        <Container className="mt-[20px]">
          <BetHistory typeBet={BET_TYPE.SMALL as IBetType} />
        </Container>

        <p className={`mt-[30px] ${fontSans.className}`}>Roll History</p>
        <RollHistory />
      </div>
    </main>
  );
}
