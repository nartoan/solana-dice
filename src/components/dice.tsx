"use client";

import { DiceResult } from "@/types/dice-result";
import { useEffect, useRef, useState } from "react";
import DiceRoll from "react-dice-roll";
import { BetDialog } from "./bet-dialog";

type TDiceRef = {
  rollDice: (value: DiceResult) => void;
};

export default function Dice() {
  const diceRef1 = useRef<TDiceRef>(null);
  const diceRef2 = useRef<TDiceRef>(null);
  const diceRef3 = useRef<TDiceRef>(null);

  const defaultValue: DiceResult[] = [1, 2, 3];
  const cheatValue: DiceResult[] = [1, 2, 3];

  useEffect(() => {
    const interval = setInterval(() => {
      diceRef1.current?.rollDice(1);
      diceRef2.current?.rollDice(2);
      diceRef3.current?.rollDice(2);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 5000)
  }, []);

  return (
    <>
      <div className="flex justify-around items-center py-[20px] h-[98px]">
        <DiceRoll
          ref={diceRef1}
          size={60}
          rollingTime={25000}
          defaultValue={defaultValue[0]}
          cheatValue={cheatValue[0]}
          disabled={true}
        />
        <DiceRoll
          ref={diceRef2}
          size={60}
          rollingTime={25000}
          defaultValue={defaultValue[1]}
          cheatValue={cheatValue[1]}
          disabled={true}
        />
        <DiceRoll
          ref={diceRef3}
          size={60}
          rollingTime={25000}
          defaultValue={defaultValue[2]}
          cheatValue={cheatValue[2]}
          disabled={true}
        />
      </div>
      <BetDialog open={isOpen} setOpen={setIsOpen} />
    </>
  );
}
