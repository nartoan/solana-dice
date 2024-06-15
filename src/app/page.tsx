'use client'

import BetButton, { IBetType } from "@/components/BetButton";
import Dice from "@/components/Dice";
import Header from "@/components/Header";
import PriceBet from "@/components/PriceBet";
import WalletSelection from "@/components/WalletSelection";
import { Badge } from "@/components/ui/badge";

import { Silkscreen as FontSans } from "next/font/google";
import { useState } from "react";

const fontSans = FontSans({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const [selectedPrice, setSelectedPrice] = useState<number>(0.1);
  const [bet, setBet] = useState<IBetType>();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-5xl">
        <Header />
        <WalletSelection />
        <div className={`bg-[#0B0B1F] h-[130px] flex justify-center items-center text-center mt-[20px] text-[50px] leading-none ${fontSans.className}`}>
          Big & Small Dice
        </div>
        <div className={`flex flex-col bg-[#0B0B1F] rounded-[10px] mt-5 p-[16px] gap-[20px]`}>
          <div className="flex justify-between">
            <span className="text-[10px]">Time left until the next game:</span>
            <Badge>00:56</Badge>
          </div>
          <div className="rounded-[10px] border-solid border border-[#344EAD]">
            <Dice />
          </div>
          <div className="flex justify-around items-center">
            <PriceBet price={0.1} selectedPrice={selectedPrice} onClick={setSelectedPrice} />
            <PriceBet price={0.3} selectedPrice={selectedPrice} onClick={setSelectedPrice} />
            <PriceBet price={0.5} selectedPrice={selectedPrice} onClick={setSelectedPrice} />
            <PriceBet price={0.7} selectedPrice={selectedPrice} onClick={setSelectedPrice} />
            <PriceBet price={1.0} selectedPrice={selectedPrice} onClick={setSelectedPrice} />
          </div>
          <div className="flex justify-around items-center gap-[20px]">
            <BetButton bet="small" selectedBet={bet} onClick={setBet} />
            <BetButton bet="big" selectedBet={bet} onClick={setBet} />
          </div>
        </div>
      </div>
    </main>
  );
}
