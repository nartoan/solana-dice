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

  // Use refs for values that don't need to trigger a re-render
  const currentGameStatus = useRef<IGameStatus | null>(null);
  const currentPayoutHistories = useRef<
    { results: DiceResult[]; address: string }[]
  >([]);
  const currentBetHistories = useRef<
    { address: string; amount: number; type: IBetType }[]
  >([]);
  const currentBetType = useRef<IBetType | null>(null);
  const currentRollResult = useRef<DiceResult[]>([]);
  const wasBetListEmpty = useRef(true);
  const finishedRolling = useRef(true);
  const payoutHistoryUpdated = useRef(false);
  const rollingStartTime = useRef(Date.now());
  const showResultDialogCount = useRef(0);
  const showResultDialogDuration = 4;
  const showResultLastTime = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = timerRef.current.getRemainingTime();

      if (finishedRolling.current) {
        resetBetState();
      }

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
    console.log(
      "timerRef.current.getRemainingTime: ",
      timerRef.current.getRemainingTime()
    );
    console.log("handleBetClosted finishedRolling: ", finishedRolling.current);
    console.log("handleBetClosted wasBetListEmpty: ", wasBetListEmpty.current);
    if (finishedRolling.current) {
      if (currentBetHistories.current.length > 0) {
        console.log("set wasBetListEmpty to FALSE");
        wasBetListEmpty.current = false;
      } else {
        console.log("set wasBetListEmpty to TRUE");
        wasBetListEmpty.current = true;
      }
      updateGameStatus(GAME_STATUS.BET_CLOSED);
      showResultDialogCount.current = 0;
      finishedRolling.current = false;
    }
  };

  const handleRollingTimeCheck = () => {
    if (wasBetListEmpty.current) {
      if (currentPayoutHistories.current.length > 0) {
        const result = generateResultFromPayoutHistory();
        currentRollResult.current = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
      }
    } else {
      if (payoutHistoryUpdated.current) {
        const result = generateResultFromBetHistory();
        currentRollResult.current = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
        rollingStartTime.current = Date.now();
        wasBetListEmpty.current = true;
      }
    }
  };

  const handleFinalTimeCheck = () => {
    if (!wasBetListEmpty.current) {
      if (payoutHistoryUpdated.current) {
        const result = generateResultFromBetHistory();
        currentRollResult.current = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
        rollingStartTime.current = Date.now();
        wasBetListEmpty.current = true;
      }
    }
  };

  const handleDefaultTimeCheck = () => {
    console.log(
      "timerRef.current.getRemainingTime: ",
      timerRef.current.getRemainingTime()
    );
    console.log(
      "handleDefaultTimeCheck payoutHistoryUpdated: ",
      payoutHistoryUpdated.current
    );
    console.log(
      "handleDefaultTimeCheck finishedRolling: ",
      finishedRolling.current
    );
    console.log(
      "handleDefaultTimeCheck wasBetListEmpty: ",
      wasBetListEmpty.current
    );
    console.log(
      "handleDefaultTimeCheck rollingStartTime + 6000 > Date.now: ",
      rollingStartTime.current + 6000 > Date.now()
    );

    if (!wasBetListEmpty.current) {
      if (!payoutHistoryUpdated.current) {
        // Maintain game status Bets Closed
      } else {
        const result = generateResultFromBetHistory();
        currentRollResult.current = result.results;
        setResult(result);
        updateGameStatus(GAME_STATUS.ROLLING);
        rollingStartTime.current = Date.now();
        wasBetListEmpty.current = true;
      }
    } else {
      if (rollingStartTime.current + 6000 > Date.now()) {
        // Let rolling animation finish
        console.log("Let rolling animation finish");
      } else {
        if (showResultDialogCount.current <= showResultDialogDuration) {
          showResult();
          showResultDialogCount.current++;
          showResultLastTime.current = Date.now();
        } else {
          updateGameStatus(GAME_STATUS.BETTING);
        }
        console.log("set finishedRolling TRUE: ");
        finishedRolling.current = true;
        wasBetListEmpty.current = false;
      }
    }
  };

  const showResult = () => {
    if (currentRollResult.current.length === 0) {
      updateGameStatus(GAME_STATUS.BETTING);
    } else if (isThreeOfAKind(currentRollResult.current)) {
      updateGameStatus(GAME_STATUS.RESULT_THREE_OF_A_KIND);
    } else if (isBigWins(currentRollResult.current)) {
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
    const previous_payout_tx = currentPayoutHistories.current[0].address;
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
      results: currentPayoutHistories.current[0].results,
      value: 0,
      isWin:
        (currentBetType.current === BET_BIG &&
          currentPayoutHistories.current[0].results.reduce(
            (total, item) => total + item,
            0
          ) > 10) ||
        (currentBetType.current === BET_SMALL &&
          currentPayoutHistories.current[0].results.reduce(
            (total, item) => total + item,
            0
          ) <= 10),
    };
  };

  const resetBetState = () => {
    payoutHistoryUpdated.current = false;
    wasBetListEmpty.current = true;
  };

  const updateGameStatus = (newStatus: IGameStatus) => {
    if (currentGameStatus.current !== newStatus) {
      currentGameStatus.current = newStatus;
      setGameStatus(() => newStatus);
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
        currentBetHistories.current = newBetHistories;
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
        const newPayoutHistory = histories.toReversed();
        if (
          currentPayoutHistories.current.length > 0 &&
          currentPayoutHistories.current[0].address !==
            newPayoutHistory[0].address
        ) {
          payoutHistoryUpdated.current = true;
        }
        currentPayoutHistories.current = newPayoutHistory;
        setPayoutHistories(newPayoutHistory);
      } else {
        console.log("No histories found in payoutHistoryAccount.");
      }
    } catch (err) {
      console.error("Error fetching payout history:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <Header isShowSocial={false} />
      <WalletSelection />
      <div
        className={`bg-[#0B0B1F] h-[130px] md:h-[220px] flex justify-center items-center text-center mt-[20px] text-[32px] md:text-[50px] leading-none`}
      >
        <LabelCustom>大 Big & Small 細</LabelCustom>
      </div>
      <Container className={`flex flex-col mt-5 gap-[20px]`}>
        <div className="flex justify-between">
          <span className="text-[10px] md:hidden">
            Time left until the next game:
          </span>
          <LabelCustom className="hidden md:block text-[30px]">
            Time left until the next game:
          </LabelCustom>
          <Timer ref={timerRef} />
        </div>
        <div className="flex items-center justify-center rounded-[10px] border-solid border border-[#344EAD]">
          <Dice
            rolling={gameStatus === GAME_STATUS.ROLLING}
            results={result?.results}
            timerRef={timerRef}
          />
        </div>
        <Bet gameStatus={gameStatus} bet={handleBet} />
      </Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[30px]">
        <div>
          <LabelCustom classNameContainer="md:text-[24px]">
            Active Bets
          </LabelCustom>
          <Container className="mt-[20px]">
            <BetHistory typeBet={BET_BIG} betHistories={betHistories} />
          </Container>
          <Container className="mt-[20px]">
            <BetHistory typeBet={BET_SMALL} betHistories={betHistories} />
          </Container>
        </div>

        <div>
          <div className="flex justify-between items-center mt-[30px] md:mt-0">
            <LabelCustom classNameContainer="md:text-[24px]">
              Payout History
            </LabelCustom>
            <LabelCustom classNameContainer="md:text-[24px]">
              Solscan Link
            </LabelCustom>
          </div>
          <PayoutHistories data={payoutHistories} />
        </div>
      </div>
      <BetDialog open={isOpen} setOpen={setIsOpen} result={result} />
    </div>
  );
}

export default function Game() {
  return (
    <SWRProvider>
      <SolanaProvider>
        <Home />
      </SolanaProvider>
    </SWRProvider>
  );
}
