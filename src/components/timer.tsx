"use client";

import { FC } from "react";
import Countdown from "react-countdown";

const RenderCountDown: FC<{
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}> = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>You are good to go!</span>;
  } else {
    return (
      <span className="w-[92px] h-[20px] bg-primary flex justify-center items-center text-[12px] rounded-sm font-bold">
        0{hours} : 0{minutes} : {seconds}
      </span>
    );
  }
};

export default function Timer() {
  return <Countdown date={Date.now() + 590000} renderer={RenderCountDown} />;
}
