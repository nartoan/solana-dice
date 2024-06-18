"use client";

import { FC } from "react";
import Countdown from "react-countdown";

const RenderCountDown: FC<{
  hours: number;
  minutes: number;
  seconds: number;
}> = ({ hours, minutes, seconds }) => {
  return (
    <span className="w-[92px] h-[20px] bg-primary flex justify-center items-center text-[12px] rounded-sm font-bold">
      {hours.toString().padStart(2, "0")} :{" "}
      {minutes.toString().padStart(2, "0")} :{" "}
      {seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default function Timer({ timeRemain }: { timeRemain: number }) {
  return (
    <Countdown
      date={Date.now() + timeRemain * 1000}
      renderer={RenderCountDown}
    />
  );
}
