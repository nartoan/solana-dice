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
  <span className="w-[92px] md:w-[120px] h-[18px] md:h-[50px] bg-primary flex justify-center items-center text-[12px] md:text-[20px] rounded-sm font-bold">
    {children}
  </span>
);

const RenderCountDown: FC<CountdownRenderProps> = ({ minutes, seconds }) => (<RenderTimer>
      {minutes.toString().padStart(2, "0")} :{" "}
      {seconds.toString().padStart(2, "0")}
    </RenderTimer>
  );

const Timer = forwardRef((_, ref) => {
  const { data, isLoading } = useSWR("https://worldtimeapi.org/api/timezone/Etc/UTC", { revalidateOnFocus: false });

  const [targetDate, setTargetDate] = useState(0);
  const countdownRef = useRef<Countdown | null>(null);

  useImperativeHandle(ref, () => ({
    getRemainingTime: () => countdownRef.current?.calcTimeDelta().total ?? 0,
  }));

  useEffect(() => {
    if (data) {
      const offset = data.unixtime * 1000 - Date.now();
      const currentTime = Date.now() + offset;
      extendCountdown(currentTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const extendCountdown = (currentTime?: number): void => {
    const baseTime = currentTime ?? targetDate;
    const nextMinute = new Date(baseTime);
    nextMinute.setSeconds(0,0)
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    setTargetDate(nextMinute.getTime());
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
      onComplete={() => extendCountdown()}
    >
      </Countdown>
  );
});
Timer.displayName = "Timer";

export default Timer;