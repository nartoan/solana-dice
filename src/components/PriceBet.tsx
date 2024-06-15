"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

type PriceBetProps = {
    price: number;
    selectedPrice: number;
    onClick: Dispatch<SetStateAction<number>>;
}

export default function PriceBet({ price, selectedPrice, onClick }: PriceBetProps) {
    return (
        <Button variant={selectedPrice === price ? "default" : "outline"} onClick={() => onClick(price)}>{price} Sol</Button>
    );
}
