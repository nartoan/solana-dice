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
import { generateNumbers } from "@/lib/utils";
import { IBetType } from "@/types/bet";

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
  const timerRef = useRef<any>(null);

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
          userAccount: publicKey!!, // Replace with the actual user's token account public key
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc();
    } catch (e) {
      console.log("🚀 ~ handleBet ~ error:", e);
    }
  };

  let currentGameStatus: IGameStatus | null = null;
  let currentPayoutHistories: { results: DiceResult[]; address: string; }[] = [];
  let currentBetHistories: { address: string; amount: number; type: IBetType; }[] = [];
  let currentBetType: IBetType | null = null;
  let currentRollResult: DiceResult[] = [];
  let wasBetListEmpty = true;
  let finishedRolling = true;
  let payoutHistoryUpdated = false;
  let rollingStartTime = Date.now();
  let showResultDialogCount = 0;
  const showResultDialogDuration = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      // if (currentPayoutHistories.length == 0) {
      //   updateGameStatus(GAME_STATUS.LOADING);
      //   return;
      // }

      const remainingTime = timerRef.current.getRemainingTime();

      if (remainingTime > 10000 && remainingTime <= 15000) {
        handleBetClosedTimeCheck();
      } else if (remainingTime <= 10000 && remainingTime > 5000) {
        handleRollingTimeCheck();
      } else if (remainingTime <= 5000) {
        handleFinalTimeCheck();
      } else {
        handleDefaultTimeCheck();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleBetClosedTimeCheck = () => {
    if ( finishedRolling ) {
      if (currentBetHistories.length > 0) {
        wasBetListEmpty = false;
      } else {
        wasBetListEmpty = true;
      }
      updateGameStatus(GAME_STATUS.BET_CLOSED);
      showResultDialogCount = 0;
      finishedRolling = false;
    } else {
      // wasBetListEmpty = false;
    }
  };

  const handleRollingTimeCheck = () => {
    if (wasBetListEmpty) {
      if (currentPayoutHistories.length > 0) {
        const result = generateResultFromPayoutHistory();
        currentRollResult = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
      }
    } else {
      if (payoutHistoryUpdated) {
        const result = generateResultFromBetHistory();
        currentRollResult = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
        rollingStartTime = Date.now();
      }
    }
  };

  const handleFinalTimeCheck = () => {
    if (!wasBetListEmpty) {
      if (payoutHistoryUpdated) {
        const result = generateResultFromBetHistory();
        currentRollResult = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
        rollingStartTime = Date.now();
      }
    }
  };

  const handleDefaultTimeCheck = () => {
    if (!wasBetListEmpty) {
      if (!payoutHistoryUpdated) {
        // Maintain game status Bets Closed
      } else {
        const result = generateResultFromBetHistory();
        currentRollResult = result.results;
        setResult(result);
        resetBetState();
        updateGameStatus(GAME_STATUS.ROLLING);
        rollingStartTime = Date.now();
      }
    } else {
      if (rollingStartTime + 6000 > Date.now()) {
        // Let rolling animation finish
      } else {
        if (showResultDialogCount <= showResultDialogDuration) {
          showResult();
          showResultDialogCount++;
        } else {
          finishedRolling = true;
          updateGameStatus(GAME_STATUS.BETTING);
        }
      }
    }
  };

  const showResult = () => {
    if (currentRollResult.length === 0) {
      updateGameStatus(GAME_STATUS.BETTING);
    } else if (isThreeOfAKind(currentRollResult)) {
      updateGameStatus(GAME_STATUS.RESULT_THREE_OF_A_KIND);
    } else if (isBigWins(currentRollResult)) {
      updateGameStatus(GAME_STATUS.RESULT_BIG_WINS);
    } else {
      updateGameStatus(GAME_STATUS.RESULT_SMALL_WINS);
    }
  };

  const isThreeOfAKind = (results: number[]) => {
    return results[0] === results[1] && results[1] === results[2];
  };

  const isBigWins = (results: number[]) => {
    return results.reduce((total, item) => total + item, 0) > 10;
  };

  const generateResultFromPayoutHistory = () => {
    const previous_payout_tx = currentPayoutHistories[0].address;
    const current_minute = Math.floor(Date.now() / 60000);
    const concatenatedString = `${previous_payout_tx}-${current_minute}`;
    const result = generateNumbers(concatenatedString);
    return {
      results: result as DiceResult[],
      value: 0,
      isWin: false,
    };
  };

  const generateResultFromBetHistory = () => {
    return {
      results: currentPayoutHistories[0].results,
      value: 0,
      isWin:
        (currentBetType === BET_BIG && currentPayoutHistories[0].results.reduce((total, item) => total + item, 0) > 10) ||
        (currentBetType === BET_SMALL && currentPayoutHistories[0].results.reduce((total, item) => total + item, 0) <= 10),
    };
  };

  const resetBetState = () => {
    payoutHistoryUpdated = false;
    wasBetListEmpty = true;
  };

  const updateGameStatus = (newStatus: IGameStatus) => {
    if (currentGameStatus !== newStatus) {
      currentGameStatus = newStatus;
      setGameStatus(newStatus);
      // console.log("Game status updated to: ", newStatus);
    }
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
      // Print betListAccount
      console.log("BetListAccount:", betListAccount);
      console.log("betListPda:", betListPda);
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
        const newBetHistories = bets.reverse();
        currentBetHistories = newBetHistories;
        setBetHistories(newBetHistories);
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
        const newPayoutHistory = histories.reverse();
        if ( currentPayoutHistories.length > 0 && currentPayoutHistories[0].address !== newPayoutHistory[0].address ){
          payoutHistoryUpdated = true;
        }
        currentPayoutHistories = newPayoutHistory;
        setPayoutHistories(newPayoutHistory);
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

      <div className="flex justify-between items-center mt-[30px]">
        <LabelCustom classNameContainer="mt-[30px]">Payout History</LabelCustom>
        <LabelCustom classNameContainer="mt-[30px]">Solscan Link</LabelCustom>
      </div>
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
