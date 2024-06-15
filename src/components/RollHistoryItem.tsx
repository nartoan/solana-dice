"use client";

import { FC } from "react";
import Image from "next/image";

import Point1Svg from "@/assets/img/dice/1.svg";
import Point2Svg from "@/assets/img/dice/2.svg";
import Point3Svg from "@/assets/img/dice/3.svg";
import Point4Svg from "@/assets/img/dice/4.svg";
import Point5Svg from "@/assets/img/dice/5.svg";
import Point6Svg from "@/assets/img/dice/6.svg";
import { IBetType } from "@/types/bet";
import { DiceResult } from "@/types/dice-result";
import Container from "./Container";

export type IResultBet = {
  result: IBetType;
  address: string;
  detailResult: DiceResult[];
};

type IRollHistoryItemProps = {
  result: IResultBet;
};

const mapPointImg = {
  1: Point1Svg,
  2: Point2Svg,
  3: Point3Svg,
  4: Point4Svg,
  5: Point5Svg,
  6: Point6Svg,
};

const IRollHistoryImage = ({ result }: { result: DiceResult }) => (
  <Image src={mapPointImg[result]} alt="up icon" width={16} />
);

const RollHistoryItem: FC<IRollHistoryItemProps> = ({ result }) => {
  return (
    <Container className="flex justify-between text-[12px] mt-[15px]">
      <span className="font-bold capitalize w-[40px]">{result.result}</span>
      <div className="flex gap-2">
        {result.detailResult.map((result, index) => (
          <IRollHistoryImage result={result} key={index} />
        ))}
      </div>
      <span className="text-[#C9C9C9]">{result.address}</span>
    </Container>
  );
};

export default RollHistoryItem;
