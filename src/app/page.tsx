"use client";

import { useEffect, useMemo, useState, useRef } from "react";

import BetHistory, { IBetHistory } from "@/components/bet-history";
import Dice from "@/components/dice";
import Header from "@/components/header";
import WalletSelection from "@/components/wallet-selection";
import Container from "@/components/ui-custom/container";
import PayoutHistories from "@/components/payout-histories";
import Bet from "@/components/bet";
import Timer from "@/components/timer";
import LabelCustom from "@/components/ui-custom/label-custom";
import { BetDialog } from "@/components/bet-dialog";
import { BET_BIG, BET_SMALL, GAME_STATUS } from "@/const";
import { IGameStatus } from "@/types/game-status";
import { SWRProvider } from "@/provider/swr";
import { SolanaProvider } from "@/provider/solana";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState<IGameStatus>(
    GAME_STATUS.BETTING
  );
  const [betHistories, setBetHistories] = useState<IBetHistory[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = timerRef.current.getRemainingTime();
      if (remainingTime > 10000 && remainingTime <= 15000) {
        setGameStatus(GAME_STATUS.BET_CLOSED);
      } else if (remainingTime <= 10000) {
        // TODO: Check if there's any new roll history
        // If there's a new roll result, set the dice result and roll
        // Otherwise, roll the dice with random numbers
        setGameStatus(GAME_STATUS.ROLLING);
      } else {
        setGameStatus(GAME_STATUS.BETTING);
      }
    }, 1000); // Check every second
    return () => clearInterval(interval);
    // setTimeout(() => setIsOpen(true), 5000)
  }, []);

  const handleBet = (betData: IBetHistory) => {
    setBetHistories((betHistories) => [...betHistories, betData]);
  };

  return (
    <SWRProvider>
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
              <Timer ref={timerRef} />
            </div>
            <div className="rounded-[10px] border-solid border border-[#344EAD]">
              <Dice rolling={gameStatus === GAME_STATUS.ROLLING} />
            </div>
            <Bet gameStatus={gameStatus} bet={handleBet} />
          </Container>
          <LabelCustom classNameContainer="mt-[30px]">Active Bets</LabelCustom>
          <Container className="mt-[20px]">
            <BetHistory typeBet={BET_BIG} betHistories={betHistories} />
          </Container>
          <Container className="mt-[20px]">
            <BetHistory typeBet={BET_SMALL} betHistories={betHistories} />
          </Container>

          <LabelCustom classNameContainer="mt-[30px]">
            Payout History
          </LabelCustom>
          <PayoutHistories />
          <BetDialog open={isOpen} setOpen={setIsOpen} />
        </div>
      </SolanaProvider>
    </SWRProvider>
  );
}
