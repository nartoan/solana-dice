import { useState } from "react";
import { IBetType } from "@/types/bet";
import PriceBet from "./PriceBet";
import BetButton from "./BetButton";

export default function Bet() {
  const [selectedPrice, setSelectedPrice] = useState<number>(0.1);
  const [bet, setBet] = useState<IBetType | undefined>();
  const [isRolling, setRolling] = useState<boolean>(true);

  return (
    <div className="relative">
      <div className="flex flex-col gap-[20px]">
        <div className="flex justify-around items-center">
          <PriceBet
            price={0.1}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={0.3}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={0.5}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={0.7}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={1.0}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
        </div>
        <div className="flex justify-around items-center gap-[20px]">
          <BetButton bet="small" selectedBet={bet} onClick={setBet} />
          <BetButton bet="big" selectedBet={bet} onClick={setBet} />
        </div>
      </div>
      {isRolling ? (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <span className="max-w-[200px] text-center">Rolling was started</span>
        </div>
      ) : null}
    </div>
  );
}
