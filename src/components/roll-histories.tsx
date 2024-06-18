"use client";

import { useState } from "react";
import RollHistoryItem, { IResultBet } from "./roll-history-item";
import PaginationCustom, { ITEM_PER_PAGE } from "./pagination-custom";

const datas: IResultBet[] = [
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

export default function RollHistories() {
  const [page, setPage] = useState(1);

  const datasPage = datas.filter(
    (_, index) =>
      index >= (page - 1) * ITEM_PER_PAGE && index < page * ITEM_PER_PAGE
  );
  const total = datas.length;

  return (
    <>
      {datasPage.map((rollHistory, index) => (
        <RollHistoryItem result={rollHistory} key={index} />
      ))}
      <PaginationCustom total={total} page={page} setPage={setPage} />
    </>
  );
}
