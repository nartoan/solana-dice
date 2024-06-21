"use client";

import { useEffect, useState, useRef } from "react";
import bs58 from "bs58";

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
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchor } from "@/anchor/setup";
import { IResultBet } from "@/components/payout-histories/item";
import { DiceResult } from "@/types/dice-result";
import { BN, web3 } from "@coral-xyz/anchor";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
// import { capitalizeFirstLetter } from "@/lib/utils";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState<IGameStatus>(
    GAME_STATUS.BETTING
  );
  const [betHistories, setBetHistories] = useState<IBetHistory[]>([]);
  const [payoutHistories, setPayoutHistories] = useState<IResultBet[]>([]);
  const timerRef = useRef<any>(null);

  const { publicKey } = useWallet();
  const {
    program,
    programID,
    housePublicKey,
    connection,
    payoutHistoryPda,
    betListPda,
  } = useAnchor();

  // Define the mapping object
  const betMapping = {
    small: { small: {} },
    big: { big: {} },
  };

  const handleBet = async (betData: IBetHistory) => {
    await program.methods
      .placeBet(
        betMapping[betData.type],
        new BN(betData.amount * LAMPORTS_PER_SOL)
      )
      .accounts({
        user: publicKey?.toBase58(),
        house: housePublicKey,
        betList: betListPda,
        userAccount: publicKey!!, // Replace with the actual user's token account public key
        systemProgram: programID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([])
      .rpc();
  };

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
    // TODO: show result setTimeout(() => setIsOpen(true), 5000)
  }, []);

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

        setBetHistories(bets);
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
        const histories = payoutHistoryAccount.histories.map((history) => {
          const txSig: number[] = Array.from(history.txSig);
          return {
            results: Array.from(history.result) as DiceResult[],
            address: bs58.encode(txSig),
          };
        });
        setPayoutHistories(histories.reverse());
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

      <LabelCustom classNameContainer="mt-[30px]">Payout History</LabelCustom>
      <PayoutHistories data={payoutHistories} />
      <BetDialog open={isOpen} setOpen={setIsOpen} />
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
