"use client";

import { FC, useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import Countdown, { CountdownRendererFn, CountdownRenderProps } from "react-countdown";
import axios from "axios";

// Fetch server time from the given API endpoint
const fetchServerTime = async () => {
  const response = await axios.get('https://worldtimeapi.org/api/timezone/Etc/UTC');
  return response.data.unixtime * 1000; // Convert to milliseconds
};

const RenderCountDown: FC<CountdownRenderProps> = ({ hours, minutes, seconds }) => {
  return (
    <span className="w-[92px] h-[20px] bg-primary flex justify-center items-center text-[12px] rounded-sm font-bold">
      {hours.toString().padStart(2, "0")} :{" "}
      {minutes.toString().padStart(2, "0")} :{" "}
      {seconds.toString().padStart(2, "0")}
    </span>
  );
};

const Timer = forwardRef((props, ref) => {
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [targetDate, setTargetDate] = useState(Date.now() + 60000); // Initialize with a 1-minute countdown
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<Countdown | null>(null);

  useImperativeHandle(ref, () => ({
    getRemainingTime: () => {
      if (countdownRef.current) {
        return countdownRef.current.calcTimeDelta().total;
      }
      return 0;
    }
  }));

  useEffect(() => {
    const getTime = async () => {
      const serverTime = await fetchServerTime();
      const localTime = Date.now();
      const offset = serverTime - localTime;
      setServerTimeOffset(offset);
      setNewTargetDate(offset);
    };
    getTime();

    // Optional: Refresh the server time offset every hour to correct any drift
    intervalRef.current = setInterval(() => {
      getTime();
    }, 3600000); // 1 hour in milliseconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

export default Timer;
