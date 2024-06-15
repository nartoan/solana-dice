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
import RollHistoryItem, { IResultBet } from "./RollHistoryItem";

export default function RollHistories() {
  const datas: IResultBet[] = [
    {
      address: "3hTpq........4TB5fU",
      result: [4, 5, 6],
    },
    {
      address: "3hTpq........4TB5fU",
      result: [1, 2, 5],
    },
    {
      address: "3hTpq........4TB5fU",
      result: [1, 2, 6],
    },
    {
      address: "3hTpq........4TB5fU",
      result: [4, 5, 6],
    },
    {
      address: "3hTpq........4TB5fU",
      result: [2, 2, 2],
    },
    {
      address: "3hTpq........4TB5fU",
      result: [1, 2, 6],
    },
  ];
  return (
    <>
      {datas.map((rollHistory, index) => (
        <RollHistoryItem result={rollHistory} key={index} />
      ))}
      <Pagination className="my-[20px]">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
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
