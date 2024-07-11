"use client";

import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";
import { TimelineElement, TimelineLayout } from "@/components/ui/timeline/timeline-layout";

const timelineData: TimelineElement[] = [
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

export default function Rules() {
  return (
    <div className="w-full max-w-5xl">
      <Header isShowSocial isStyled />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
        <div>Token Sale</div>
        <LabelCustom classNameContainer="mt-4 text-[32px]">
          Company Roadmap
        </LabelCustom>
        <TimelineLayout items={timelineData} />
      </div>
    </div>
  );
}
