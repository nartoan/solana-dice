"use client";

import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";
import { TimelineLayout } from "@/components/ui/timeline/timeline-layout";

export const timelineData = [
  {
    id: 1,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
  {
    id: 2,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
  {
    id: 3,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
  {
    id: 4,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
  {
    id: 5,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
  {
    id: 6,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
  {
    id: 7,
    title: "Token Sale",
    date: "2022-01-01",
    description: "Announcement",
  },
];

export type TimelineData = (typeof timelineData)[number];

export interface TimelineElement {
  id: number;
  title: string;
  date: string;
  description: string;
}

export default function Rules() {
  return (
    <div className="w-full max-w-5xl">
      <Header />
      <div className="flex flex-col items-center mt-20">
        <div>Token Sale</div>
        <LabelCustom classNameContainer="mt-4 text-[32px]">
          Company Roadmap
        </LabelCustom>
        <TimelineLayout items={timelineData} />
      </div>
    </div>
  );
}
