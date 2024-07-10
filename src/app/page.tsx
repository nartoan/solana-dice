"use client";

import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";
import Image from "next/image";

import diceSvg from "@/assets/img/dice.svg";
import { Button } from "@/components/ui/button";
import { ButtonSocial } from "@/components/buttons-social";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-5xl">
      <Header />
      <div className="flex flex-col items-center mt-20 md:mt-32">
        <Image src={diceSvg} alt={"Dice icon"} />
        <LabelCustom classNameContainer="mt-4 text-[32px]">
          大 Big & Small 細
        </LabelCustom>
        <div className="flex flex-col md:flex-row gap-4 mt-10 w-4/5">
          <Button className="rounded-none w-full">
            <Link href="/game">ENTER GAME</Link>
          </Button>
          <Button className="rounded-none w-full" variant="outline">
            <Link href="/roadmap">ROAD MAP</Link>
          </Button>
        </div>
        <div className="flex gap-6 mt-24 md:hidden">
          <ButtonSocial />
        </div>
      </div>
    </div>
  );
}
