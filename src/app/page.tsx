"use client";

import { useEffect, useState, useRef } from "react";
import { Program, web3, BN, Idl } from "@coral-xyz/anchor";

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

  const {
    provider,
    program,
    housePublicKey,
    connection,
    payoutHistoryPda,
    rollHistoryPda,
    betListPda,
  } = useAnchor();
  const { publicKey } = useWallet();

  useEffect(() => {
    subscribeBetList(program);
    subscribePayoutHistory(program);
    fetchActiveBetList(program);
    fetchRollHistory(program);
    fetchPayoutHistory(program);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  const subscribeBetList = async (program: Program<Idl>) => {
    try {
      // Subscribe to account changes
      const id = connection.onAccountChange(betListPda, (accountInfo) => {
        // Handle account change...
        fetchActiveBetList(program);
        fetchRollHistory(program);
        fetchPayoutHistory(program);
      });
    } catch (err) {
      console.error("Error subscribing to bets:", err);
      // Don't forget to unsubscribe when you no longer use it
      // connection.removeAccountChangeListener(id);
    }
  };

  const subscribePayoutHistory = async (program: Program<Idl>) => {
    try {
      // Subscribe to account changes
      const id = connection.onAccountChange(payoutHistoryPda, (accountInfo) => {
        // Handle account change...
        fetchPayoutHistory(program);
      });
    } catch (err) {
      console.error("Error subscribing to bets:", err);
      // Don't forget to unsubscribe when you no longer use it
      // connection.removeAccountChangeListener(id);
    }
  };

  const fetchActiveBetList = async (program: Program<Idl>) => {
    try {
      const betListAccount = await program.account.betList.fetch(betListPda);
      const bets = betListAccount.bets.filter((bet) => bet !== null);

      setBetList(bets);
    } catch (err) {
      console.error("Error fetching active bets:", err);
    }
  };

  const fetchRollHistory = async (program: Program<Idl>) => {
    try {
      const rollHistoryAccount = await program.account.rollHistory.fetch(
        rollHistoryPda
      );
      const results = rollHistoryAccount.results.map((result) =>
        Array.from(result)
      );

      setRollHistory(results.reverse());
      // setDiceValues(results[0]);

      setDiceOneValue(results[0][0]);
      setDiceTwoValue(results[0][1]);
      setDiceThreeValue(results[0][2]);

      // TODO: start roll
    } catch (err) {
      console.error("Error fetching roll history:", err);
    }
  };

  const fetchPayoutHistory = async (program: Program<Idl>) => {
    try {
      const payoutHistoryAccount = await program.account.payoutHistory.fetch(
        payoutHistoryPda
      );
      if (
        payoutHistoryAccount.histories &&
        payoutHistoryAccount.histories.length > 0
      ) {
        const histories = payoutHistoryAccount.histories.map((history) => {
          const result = Array.from(history.result);
          const txSig = Array.from(history.txSig);
          const encodedTxSig = txSig.to;
          return {
            result,
            encodedTxSig,
            txSig: encodedTxSig,
            truncatedTxSig: `${encodedTxSig.substring(0, 10)}...`,
          };
        });
        setPayoutHistory(histories.reverse());
      } else {
        console.log("No histories found in payoutHistoryAccount.");
      }
    } catch (err) {
      console.error("Error fetching payout history:", err);
    }
  };

  const placeBet = async () => {
    if (program && provider) {
      try {
        await program.methods
          .placeBet(betMapping[betType], new BN(amount * LAMPORTS_PER_SOL))
          .accounts({
            user: provider.wallet.publicKey,
            house: housePublicKey,
            betList: betListPda,
            userAccount: publicKey!!, // Replace with the actual user's token account public key
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([])
          .rpc();
      } catch (err) {
        console.error("Error placing bet:", err);
      }
    }
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
