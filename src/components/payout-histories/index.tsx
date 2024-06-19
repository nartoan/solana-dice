"use client";

import { useState } from "react";
import PayoutHistoryItem, { IResultBet } from "./item";
import PaginationCustom, { ITEM_PER_PAGE } from "../ui-custom/pagination-custom";

const data: IResultBet[] = [
  {
    address: "3hTpq........4TB5fU",
    results: [4, 5, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 5],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [4, 5, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },

  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [2, 2, 2],
  },
  {
    address: "3hTpq........4TB5fU",
    results: [1, 2, 6],
  },
];

export default function PayoutHistories() {
  const [page, setPage] = useState(1);

  const dataPage = data.filter(
    (_, index) =>
      index >= (page - 1) * ITEM_PER_PAGE && index < page * ITEM_PER_PAGE
  );
  const total = data.length;

  return (
    <>
      {dataPage.map((payoutHistory, index) => (
        <PayoutHistoryItem result={payoutHistory} key={index} />
      ))}
      <PaginationCustom total={total} page={page} setPage={setPage} />
    </>
  );
}
