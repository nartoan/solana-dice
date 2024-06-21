import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { IBetType } from "./types/bet";
import { IGameStatus } from "./types/game-status";

export const BET_SMALL: IBetType = "small";
export const BET_BIG: IBetType = "big";

export const BET_TYPE: Array<{ title: IBetType; range: number[] }> = [
  {
    title: BET_SMALL,
    range: [3, 10],
  },
  {
    title: BET_BIG,
    range: [11, 18],
  },
];

export const GAME_STATUS: { [key: string]: IGameStatus } = {
  BETTING: "betting",
  ROLLING: "rolling",
  BET_CLOSED: "bet_closed",
};

export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet