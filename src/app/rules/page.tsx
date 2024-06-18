"use client";

import Header from "@/components/header";
import LabelCustom from "@/components/label-custom";

export default function Rules() {
  const rules = [
    {
      title: "Game Overview",
      content: `In this game, you place bets on whether the total sum of three dice rolls will be "Big" (11-18) or "Small" (3-10). Here’s what makes this game so exciting and unique:`,
    },
    {
      title: "Built on Solana:",
      content: `Enjoy lightning-fast transactions and low fees, thanks to Solana's high-performance blockchain.`,
    },
    {
      title: "Provably Fair with VRF:",
      content: `Our game uses VRF to generate truly random and verifiable dice rolls. The randomness is cryptographically secure, ensuring that no one can tamper with the results.`,
    },
    {
      title: "Simple and Rewarding:",
      content: `Place your bets on either "Big" or "Small" and double your wager if you guess correctly. If all three dice show the same number (e.g., 1-1-1 or 6-6-6), it's considered "three of a kind," and the house takes all bets.`,
    },
    {
      title: "Why It's Cool Transparency:",
      content: `Every roll is recorded on the blockchain, making the entire process transparent and verifiable by anyone.`,
    },
    {
      title: "Fairness:",
      content: `Using VRF ensures that the results are truly random and cannot be manipulated by any party, including the house.`,
    },
    {
      title: "Excitement:",
      content: `The anticipation of the roll and the possibility of doubling your bet makes every game thrilling.`,
    },
    {
      title: "Security:",
      content: `Built on Solana, our game leverages the robust security features of one of the most advanced blockchains available.`,
    },
    {
      title: "How to Play:",
      content: `Place Your Bet: Choose "Big" or "Small" and place your wager.`,
    },
    {
      title: "Wait for the Roll:",
      content: `Watch as the three dice spin and land on their numbers.`,
    },
    {
      title: "Win or Lose:",
      content: `If you guessed correctly, you double your bet! But beware, if the dice show three of a kind, the house takes all.`,
    },
  ];

  return (
    <div className="w-full max-w-xl">
      <Header />
      {rules.map(({ title, content }, index) => (
        <div key={index} className="mt-[20px]">
          <LabelCustom classNameContainer="mt-[30px]">{title}</LabelCustom>
          <div className="text-[14px] text-[#C2C2C2] mt-[4px]">{content}</div>
        </div>
      ))}
    </div>
  );
}
