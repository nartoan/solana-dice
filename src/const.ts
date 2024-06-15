import { IBetType } from "./types/bet";

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
