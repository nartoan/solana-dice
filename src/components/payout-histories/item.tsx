"use client";

import { FC } from "react";
import { DiceResult } from "@/types/dice-result";
import Container from "../ui-custom/container";
import PayoutHistoryImage from "./image";
import { getResultText } from "@/lib/utils";

export type IResultBet = {
  address: string;
  results: DiceResult[];
};

type PayoutHistoryItemProps = {
  result: IResultBet;
};

const PayoutHistoryItem: FC<PayoutHistoryItemProps> = ({ result }) => {
  return (
    <Container className="flex justify-between items-center text-[12px] mt-[15px]">
      <span className="font-bold capitalize w-[60px] h-[23px] flex items-center">
        {getResultText(result.results)}
      </span>
      <PayoutHistoryImage results={result.results} />
      <span className="text-[#C9C9C9]">{result.address}</span>
    </Container>
  );
};

export default PayoutHistoryItem;
