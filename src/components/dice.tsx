"use client";

import { useEffect, useRef } from "react";
import DiceRoll from "@nartoan/react-dice-roll";
import svg1 from "@/assets/img/dice-custom/1.svg";
import svg2 from "@/assets/img/dice-custom/2.svg";
import svg3 from "@/assets/img/dice-custom/3.svg";
import svg4 from "@/assets/img/dice-custom/4.svg";
import svg5 from "@/assets/img/dice-custom/5.svg";
import svg6 from "@/assets/img/dice-custom/6.svg";

import { DiceResult } from "@/types/dice-result";
import { randomInt } from "@/lib/utils";

type TDiceRef = {
  rollDice: (value?: DiceResult) => void;
};

const FACES = [svg1.src, svg2.src, svg3.src, svg4.src, svg5.src, svg6.src];
const SIZE = 50;

export default function Dice() {
  const diceRef1 = useRef<TDiceRef>(null);
  const diceRef2 = useRef<TDiceRef>(null);
  const diceRef3 = useRef<TDiceRef>(null);

  const defaultValue: DiceResult[] = [
    randomInt(1, 6),
    randomInt(1, 6),
    randomInt(1, 6),
  ];
  const cheatValue: DiceResult[] = [
    randomInt(1, 6),
    randomInt(1, 6),
    randomInt(1, 6),
  ];
  const rollTime = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      diceRef1.current?.rollDice();
      diceRef2.current?.rollDice();
      diceRef3.current?.rollDice();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex justify-around items-center py-[20px] h-[98px]">
        <DiceRoll
          ref={diceRef1}
          size={SIZE}
          rollingTime={rollTime}
          defaultValue={defaultValue[0]}
          cheatValue={cheatValue[0]}
          disabled={true}
          faces={FACES}
        />
        <DiceRoll
          ref={diceRef2}
          size={SIZE}
          rollingTime={rollTime}
          defaultValue={defaultValue[1]}
          cheatValue={cheatValue[1]}
          disabled={true}
          faces={FACES}
        />
        <DiceRoll
          ref={diceRef3}
          size={SIZE}
          rollingTime={rollTime}
          defaultValue={defaultValue[2]}
          cheatValue={cheatValue[2]}
          disabled={true}
          faces={FACES}
        />
      </div>
    </>
  );
}
