"use client";

import { MutableRefObject, useEffect, useRef } from "react";
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
  rollDice: (value?: DiceResult, remainTime?: number) => void;
};

const FACES = [svg1.src, svg2.src, svg3.src, svg4.src, svg5.src, svg6.src];
const SIZE = 50;
const ROLL_TIME = 10000;
const NEXT_ROLE_TIME = 1000;

export default function Dice({
  rolling,
  results = [randomInt(1, 6), randomInt(1, 6), randomInt(1, 6)],
  timerRef,
}: {
  rolling: boolean;
  results?: DiceResult[];
  timerRef: MutableRefObject<any>;
}) {
  const diceRef1 = useRef<TDiceRef>(null);
  const diceRef2 = useRef<TDiceRef>(null);
  const diceRef3 = useRef<TDiceRef>(null);

  const defaultValue: DiceResult[] = [
    randomInt(1, 6),
    randomInt(1, 6),
    randomInt(1, 6),
  ];

  useEffect(() => {
    if (rolling) {
      const remainTime: number = timerRef.current.getRemainingTime();
      diceRef1.current?.rollDice(results[0], remainTime);
      setTimeout(() => {
        diceRef2.current?.rollDice(results[0], remainTime - NEXT_ROLE_TIME);
        setTimeout(() => {
          diceRef3.current?.rollDice(results[0], remainTime - NEXT_ROLE_TIME * 2);
        }, NEXT_ROLE_TIME);
      }, NEXT_ROLE_TIME);
    }
  }, [rolling, results, timerRef]);

  return (
    <div className="flex justify-around items-center py-[20px] h-[98px]">
      <DiceRoll
        ref={diceRef1}
        size={SIZE}
        rollingTime={ROLL_TIME}
        defaultValue={defaultValue[0]}
        disabled={true}
        faces={FACES}
      />
      <DiceRoll
        ref={diceRef2}
        size={SIZE}
        rollingTime={ROLL_TIME - NEXT_ROLE_TIME}
        defaultValue={defaultValue[1]}
        disabled={true}
        faces={FACES}
      />
      <DiceRoll
        ref={diceRef3}
        size={SIZE}
        rollingTime={ROLL_TIME - NEXT_ROLE_TIME * 2}
        defaultValue={defaultValue[2]}
        disabled={true}
        faces={FACES}
      />
    </div>
  );
}
