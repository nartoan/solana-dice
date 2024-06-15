"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { IBetType } from "@/types/bet";

type BetButtonProps = {
  bet: IBetType;
  selectedBet: IBetType | undefined;
  onClick: Dispatch<SetStateAction<IBetType | undefined>>;
};

export default function BetButton({
  bet,
  selectedBet,
  onClick,
}: BetButtonProps) {
  return (
    <Button
      className="flex flex-col h-[78px] w-1/2 rounded-xl"
      variant={selectedBet === bet ? "default" : "outline"}
      onClick={() => onClick(bet)}
    >
      <span className="text-[8px]">Place bet</span>
      <span className="font-bold capitalize">{bet}</span>
      <span className="text-[8px]">(03-10)</span>
    </Button>
  );
}
