"use client";

import { FC } from "react";
import { DiceResult } from "@/types/dice-result";
import Container from "./container";
import RollHistoryImage from "./roll-history-img";
import { BET_BIG, BET_SMALL } from "@/const";

export type IResultBet = {
  address: string;
  results: DiceResult[];
};

type IRollHistoryItemProps = {
  result: IResultBet;
};

const RollHistoryItem: FC<IRollHistoryItemProps> = ({ result }) => {
  const totalResult = result.results.reduce((total, item) => total + item, 0);

  let resultText: string = totalResult <= 10 ? BET_SMALL : BET_BIG;
  if (result.results.every((val, _, arr) => val === arr[0])) {
    resultText = "Three of the kind";
  }

  return (
    <Container className="flex justify-between items-center text-[12px] mt-[15px]">
      <span className="font-bold capitalize w-[60px] h-[23px] flex items-center">
        {resultText}
      </span>
      <RollHistoryImage results={result.results} />
      <span className="text-[#C9C9C9]">{result.address}</span>
    </Container>
  );
};

export default RollHistoryItem;
