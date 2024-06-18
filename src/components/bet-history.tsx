"use client";

import Image from "next/image";
import upSvg from "@/assets/img/up.svg";
import downSvg from "@/assets/img/down.svg";
import noDataSvg from "@/assets/img/no-data.svg";
import solanaSvg from "@/assets/img/solana.svg";
import { IBetType } from "@/types/bet";
import { BET_BIG } from "@/const";

import { ScrollArea } from "./ui/scroll-area";

export type IBetHistoryProps = {
  typeBet: IBetType;
};

interface BetHistory {
  address: string;
  amount: number;
}

export default function BetHistory({ typeBet }: IBetHistoryProps) {
  const betHistories: BetHistory[] = typeBet === BET_BIG ? [
    {
      address: "T19HikdasT19HikdasT19HikdasT19HikdasT19Hikdas",
      amount: 0.1,
    },
    {
      address: "T19HikdasT19HikdasT19HikdasT19HikdasT19Hikdas",
      amount: 1,
    },
    {
      address: "T19HikdasT19HikdasT19HikdasT19HikdasT19Hikdas",
      amount: 0.2,
    },
  ] : [];

  const total = betHistories.reduce(
    (total, betHistory) => total + betHistory.amount,
    0
  );

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span className="font-bold capitalize">{typeBet}</span>
          <Image
            src={typeBet === BET_BIG ? upSvg : downSvg}
            alt="up icon"
            width={8}
          />
        </div>
        <div>
          <span className="text-[8px]">Total amount:</span>
          <span className="text-[12px] font-bold ml-3">
            {total.toFixed(1)} Sol
          </span>
        </div>
      </div>

      {betHistories.length <= 0 ? (
        <div className="w-full h-[90px] flex flex-col justify-center items-center">
          <Image src={noDataSvg} alt="No data" width={22} />
          <span className="text-[12px]">No bets yet</span>
        </div>
      ) : (
        <ScrollArea className="w-full h-[90px]">
          {betHistories.map((betHistory, index) => (
            <div className="flex justify-between w-full mt-[10px]" key={index}>
              <span className="w-1/4 truncate text-[12px]">
                {betHistory.address}
              </span>
              <div className="flex items-center justify-between">
                <Image src={solanaSvg} alt="up icon" width={15} />
                <span className="text-[12px] w-[50px] text-end">
                  {betHistory.amount.toFixed(1)} Sol
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </>
  );
}
