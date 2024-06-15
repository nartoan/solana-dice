"use client";

import { FC } from "react";
import { DiceResult } from "@/types/dice-result";
import Container from "./container";
import RollHistoryImage from "./roll-history-img";
import { getResultText } from "@/lib/utils";

export type IResultBet = {
  address: string;
  results: DiceResult[];
};

type IRollHistoryItemProps = {
  result: IResultBet;
};

const RollHistoryItem: FC<IRollHistoryItemProps> = ({ result }) => {
  return (
    <Container className="flex justify-between items-center text-[12px] mt-[15px]">
      <span className="font-bold capitalize w-[60px] h-[23px] flex items-center">
        {getResultText(result.results)}
      </span>
      <RollHistoryImage results={result.results} />
      <span className="text-[#C9C9C9]">{result.address}</span>
    </Container>
  );
};

export default RollHistoryItem;
