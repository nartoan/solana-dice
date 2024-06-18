import { memo, useCallback, useState } from "react";
import { IBetType } from "@/types/bet";
import PriceBet from "./bet-price";
import BetButton from "./bet-button";
import { BET_BIG, BET_SMALL } from "@/const";
import LabelCustom from "../label-custom";
import { IBetHistory } from "../bet-history";
import { useWallet } from "@solana/wallet-adapter-react";

function Bet({
  rolling,
  bet,
}: {
  rolling: boolean;
  bet: (betData: IBetHistory) => void;
}) {
  const { publicKey } = useWallet();
  const [selectedPrice, setSelectedPrice] = useState<number>(0.1);

  const handleBet = useCallback(
    (typeBet: IBetType) => () => {
      if (publicKey) {
        bet({
          amount: selectedPrice,
          type: typeBet,
          address: publicKey.toBase58(),
        });
      }
    },
    [publicKey, selectedPrice]
  );

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
          <BetButton bet={BET_SMALL} onClick={handleBet(BET_SMALL)} />
          <BetButton bet={BET_BIG} onClick={handleBet(BET_BIG)} />
        </div>
      </div>
      {rolling ? (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[200px] text-center">
            Rolling...
          </LabelCustom>
        </div>
      ) : null}
    </div>
  );
}

export default memo(Bet);
