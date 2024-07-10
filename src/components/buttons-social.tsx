"use client";
import Image from "next/image";
import xSvg from "@/assets/img/x.svg";
import telegramSvg from "@/assets/img/telegram.svg";
import { Button } from "./ui/button";

export function ButtonSocial() {
    return (
        <>
            <Button size="icon">
                <Image src={xSvg} alt={"X"} />
            </Button>
            <Button size="icon">
                <Image src={telegramSvg} alt={"Telegram"} />
            </Button>
        </>
    );
}
