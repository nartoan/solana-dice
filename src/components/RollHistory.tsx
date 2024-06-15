"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DiceHistory, { IResultBet } from "./DiceHistory";

export default function RollHistory() {
  const rollHistories: IResultBet[] = [
    {
      result: "small",
      address: "3hTpq........4TB5fU",
      detailResult: [4, 5, 6],
    },
    {
      result: "big",
      address: "3hTpq........4TB5fU",
      detailResult: [1, 2, 5],
    },
    {
      result: "small",
      address: "3hTpq........4TB5fU",
      detailResult: [1, 2, 6],
    },
    {
      result: "small",
      address: "3hTpq........4TB5fU",
      detailResult: [4, 5, 6],
    },
    {
      result: "big",
      address: "3hTpq........4TB5fU",
      detailResult: [1, 2, 5],
    },
    {
      result: "small",
      address: "3hTpq........4TB5fU",
      detailResult: [1, 2, 6],
    },
  ];
  return (
    <>
      {rollHistories.map((rollHistory, index) => (
        <DiceHistory result={rollHistory} key={index} />
      ))}
      <Pagination className="my-[20px]">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">7</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
