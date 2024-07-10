"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
} from "@/components/ui/timeline/timeline";

export interface TimelineElement {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface TimelineLayoutProps {
  items: TimelineElement[]; // Replace any[] with the actual type of items.
}
export const TimelineLayout = ({ items }: TimelineLayoutProps) => {
  return (
    <Timeline className="translate-x-1/3">
      <TimelineItem>
        <TimelineConnector />
      </TimelineItem>
      <TimelineItem>
        <TimelineConnector />
      </TimelineItem>
      {items.map((item, index) => (
        <TimelineItem key={item.id}>
          <TimelineHeader>
            <TimelineIcon />
            <TimelineTitle className={index % 2 !== 0 ? "-translate-x-32" : ""}>
              {item.title}
            </TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription
              className={index % 2 !== 0 ? "-translate-x-[10.5rem]" : ""}
            >
              {item.description}
            </TimelineDescription>
          </TimelineContent>
          <TimelineContent>
            <TimelineTime className={index % 2 !== 0 ? "-translate-x-28" : ""}>
              {item.date}
            </TimelineTime>
          </TimelineContent>
          {index !== items.length - 1 && <TimelineConnector />}
        </TimelineItem>
      ))}
    </Timeline>
  );
};
