"use client";

import {
  FC,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import useSWR from "swr";

const RenderTimer: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="w-[92px] md:w-[120px] h-[18px] md:h-[40px] bg-primary flex justify-center items-center text-[12px] md:text-[17px] rounded-sm font-bold">
    {children}
  </span>
);

const RenderCountDown: FC<CountdownRenderProps> = ({ minutes, seconds }) => {
  return (
    <RenderTimer>
      {minutes.toString().padStart(2, "0")} :{" "}
      {seconds.toString().padStart(2, "0")}
    </RenderTimer>
  );
};

const Timer = forwardRef((_, ref) => {
  const { data, isLoading } = useSWR(
    "https://worldtimeapi.org/api/timezone/Etc/UTC"
  );

  const [targetDate, setTargetDate] = useState(0);
  const countdownRef = useRef<Countdown | null>(null);

  useImperativeHandle(ref, () => ({
    getRemainingTime: () => {
      return countdownRef.current?.calcTimeDelta().total || 0;
    },
  }));

  useEffect(() => {
    if (data) {
      const offset = data.unixtime * 1000 - Date.now();
      setNewTargetDate(offset);
    }
  }, [data]);

  const setNewTargetDate = (offset: number): void => {
    const currentTime: number = Date.now() + offset;
    const nextMinute: Date = new Date(currentTime);
    nextMinute.setSeconds(0, 0);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    setTargetDate(nextMinute.getTime());
  };

  const extendCountDown = (): void => {
    // Extend the countdown by 1 minute
    const nextMinute: Date = new Date(targetDate);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    setTargetDate(nextMinute.getTime());
  };

  const handleComplete = () => {
    // Reset the countdown to the next minute
    extendCountDown();
  };

  if (isLoading) {
    return <RenderTimer>Loading...</RenderTimer>;
  }

  return (
    <Countdown
      ref={countdownRef}
      key={targetDate}
      date={targetDate}
      renderer={RenderCountDown}
      onComplete={handleComplete}
    />
  );
});
Timer.displayName = "Timer";

export default Timer;
