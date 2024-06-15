import { BET_BIG, BET_SMALL } from "@/const";
import { DiceResult } from "@/types/dice-result";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getResultText = (
  results: DiceResult[],
  isCheckThree: boolean = true
) => {
  const totalResult = results.reduce((total, item) => total + item, 0);

  let resultText: string = totalResult <= 10 ? BET_SMALL : BET_BIG;
  if (isCheckThree) {
    if (results.every((val, _, arr) => val === arr[0])) {
      resultText = "Three of the kind";
    }
  }

  return resultText;
};
