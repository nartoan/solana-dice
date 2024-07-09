"use client";

import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";
import Image from "next/image";

import diceSvg from "@/assets/img/dice.svg";
import xSvg from "@/assets/img/x.svg";
import telegramSvg from "@/assets/img/telegram.svg";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full max-w-xl">
      <Header />
      <div className="flex flex-col items-center mt-20 md:mt-40">
        <Image src={diceSvg} alt={"Dice icon"} />
        <LabelCustom classNameContainer="mt-4 text-[32px]">
          大 Big & Small 細
        </LabelCustom>
        <div className="flex flex-col md:flex-row gap-4 mt-10 w-4/5">
          <Button className="rounded-none w-full">ENTER GAME</Button>
          <Button className="rounded-none w-full" variant="outline">
            ROAD MAP
          </Button>
        </div>
        <div className="flex gap-6 mt-24">
          <Button size="icon">
            <Image src={xSvg} alt={"X"} />
          </Button>
          <Button size="icon">
            <Image src={telegramSvg} alt={"Telegram"} />
          </Button>
        </div>
      </div>
    </div>
  );
}
