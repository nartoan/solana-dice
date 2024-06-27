"use client";

import { useEffect, useState, useRef } from "react";
import bs58 from "bs58";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";

import BetHistory, { IBetHistory } from "@/components/bet-history";
import Dice from "@/components/dice";
import Header from "@/components/header";
import WalletSelection from "@/components/wallet-selection";
import Container from "@/components/ui-custom/container";
import PayoutHistories from "@/components/payout-histories";
import Bet from "@/components/bet";
import Timer from "@/components/timer";
import LabelCustom from "@/components/ui-custom/label-custom";
import { BetDialog, BetResult } from "@/components/bet-result-dialog";
import { IResultBet } from "@/components/payout-histories/item";

import { BET_BIG, BET_SMALL, GAME_STATUS } from "@/const";
import { IGameStatus } from "@/types/game-status";
import { SolanaProvider } from "@/provider/solana";
import { SWRProvider } from "@/provider/swr";
import { useAnchor } from "@/anchor/setup";
import { DiceResult } from "@/types/dice-result";
import { IBetType } from "@/types/bet";
import { generateNumbers, getResultText } from "@/lib/utils";

// Define the mapping object
const betMapping = {
  small: { small: {} },
  big: { big: {} },
};

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState<IGameStatus>(
    GAME_STATUS.BETTING
  );
  const [betHistories, setBetHistories] = useState<IBetHistory[]>([]);
  const [payoutHistories, setPayoutHistories] = useState<IResultBet[]>([]);
  const [result, setResult] = useState<BetResult | null>(null);

  const payoutHistoriesRef = useRef<any>([]);
  const timerRef = useRef<any>(null);
  const hasBetRef = useRef<boolean>(false);

  const hasPayoutRef = useRef<boolean>(false);
  const curBetRef = useRef<IBetHistory | null>(null);

  const { publicKey } = useWallet();
  const { program, housePublicKey, connection, payoutHistoryPda, betListPda } =
    useAnchor();

  const handleBet = async (betData: IBetHistory) => {
    try {
      await program.methods
        .placeBet(
          betMapping[betData.type],
          new BN(betData.amount * LAMPORTS_PER_SOL)
        )
        .accounts({
          user: publicKey?.toBase58(),
          house: housePublicKey,
          betList: betListPda,
          userAccount: publicKey!!,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc();
      curBetRef.current = betData;
    } catch (e) {
      console.log("🚀 ~ handleBet ~ error:", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = timerRef.current.getRemainingTime();
      if (remainingTime > 10000 && remainingTime <= 15000) {
        hasBetRef.current = betHistories.length > 0;
        setGameStatus(GAME_STATUS.BET_CLOSED);
      } else if (remainingTime <= 10000 && remainingTime > 5000) {
        setGameStatus(GAME_STATUS.ROLLING);
      } else if (remainingTime <= 5000) {
        if (hasPayoutRef.current) {
          setResult({
            results: payoutHistoriesRef.current[0].results,
            value: curBetRef.current ? curBetRef.current.amount : 0,
            isWin:
              curBetRef.current?.type ===
              (getResultText(
                payoutHistoriesRef.current[0].results,
                false
              ) as IBetType),
          });
        } else {
          const result = generateResultFromPayoutHistory();
          setResult(result);
        }
      } else {
        setGameStatus(GAME_STATUS.BETTING);
        setResult(null); // Reset result
        hasPayoutRef.current = false;
        if (betHistories.length === 0) {
          curBetRef.current = null;
        }
      }
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const generateResultFromPayoutHistory = () => {
    const previous_payout_tx = payoutHistoriesRef.current[0].address;
    const current_minute = Math.floor(Date.now() / 60000);
    const concatenatedString = `${previous_payout_tx}-${current_minute}`;
    const result = generateNumbers(concatenatedString);
    return {
      results: result as DiceResult[],
      value: 0,
      isWin: false,
    };
  };

  useEffect(() => {
    fetchActiveBetList();
    const subscriptionId = connection.onAccountChange(betListPda, () => {
      fetchActiveBetList();
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPayoutHistory();
    const subscriptionId = connection.onAccountChange(payoutHistoryPda, () => {
      fetchPayoutHistory();
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActiveBetList = async () => {
    try {
      const betListAccount = await program.account.betList.fetch(betListPda);
      if (betListAccount && Array.isArray(betListAccount.bets)) {
        const bets = betListAccount.bets
          .filter((bet: any) => bet !== null)
          .map(
            (bet: any) =>
              ({
                address: (bet.user as PublicKey).toBase58(),
                amount: bet.amount / LAMPORTS_PER_SOL,
                type: Object.keys(bet.betType)[0],
              } as IBetHistory)
          );

        setBetHistories(bets.reverse());
      }
    } catch (err) {
      console.error("Error fetching active bets:", err);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const payoutHistoryAccount = await program.account.payoutHistory.fetch(
        payoutHistoryPda
      );
      if (
        payoutHistoryAccount.histories &&
        Array.isArray(payoutHistoryAccount.histories) &&
        payoutHistoryAccount.histories.length > 0
      ) {
        const histories = payoutHistoryAccount.histories
          .map((history) => {
            const txSig: number[] = Array.from(history.txSig);
            return {
              results: Array.from(history.result) as DiceResult[],
              address: bs58.encode(txSig),
            };
          })
          .reverse();
        if (
          payoutHistoriesRef.current.length > 0 &&
          payoutHistoriesRef.current[0].address !== histories[0].address
        ) {
          hasPayoutRef.current = true;
        }
        setPayoutHistories(histories);
        payoutHistoriesRef.current = histories;
      } else {
        console.log("No histories found in payoutHistoryAccount.");
      }
    } catch (err) {
      console.error("Error fetching payout history:", err);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <Header />
      <WalletSelection />
      <div
        className={`bg-[#0B0B1F] h-[130px] flex justify-center items-center text-center mt-[20px] text-[32px] leading-none`}
      >
        <LabelCustom className="max-w-[250px]">Big & Small Dice</LabelCustom>
      </div>
      <Container className={`flex flex-col mt-5 gap-[20px]`}>
        <div className="flex justify-between">
          <span className="text-[10px]">Time left until the next game:</span>
          <Timer ref={timerRef} />
        </div>
        <div className="rounded-[10px] border-solid border border-[#344EAD]">
          <Dice
            rolling={gameStatus === GAME_STATUS.ROLLING}
            results={result?.results}
            timerRef={timerRef}
          />
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

      <LabelCustom classNameContainer="mt-[30px]">Payout History</LabelCustom>
      <PayoutHistories data={payoutHistories} />
      <BetDialog open={isOpen} setOpen={setIsOpen} result={result} />
    </div>
  );
}

export default function HomeNew() {
  return (
    <SWRProvider>
      <SolanaProvider>
        <Home />
      </SolanaProvider>
    </SWRProvider>
  );
}
