"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RollHistoryImage from "./roll-history-img";
import { DiceResult } from "@/types/dice-result";
import Image from "next/image";
import svgClose from "@/assets/img/close.svg"

export function BetDialogWin({ open }: { open: boolean }) {
  const results: DiceResult[] = [1, 2, 3];
  const value = 0.015;

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-[#309816] w-max border-[#309816] rounded-md"
        hideCloseButton
      >
        <DialogTitle className="text-[20px]">
          Congratulations, you win
        </DialogTitle>
        <div className="flex flex-col items-center">
          <div className="flex justify-around items-center rounded py-[10px] px-[20px] bg-white text-black gap-10">
            <span className="text-[12px]">Dice results</span>
            <span className="font-bold">Big</span>
            <RollHistoryImage results={results} size={24} />
          </div>
          <div className="w-full flex items-center justify-between mt-2">
            <span>11:30 / 13.06</span>
            <span className="font-bold">+{value} Sol</span>
          </div>
        </div>
        <DialogClose asChild>
          <Image
            src={svgClose}
            alt="Close button"
            className="absolute bottom-[-40px] left-1/2"
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
