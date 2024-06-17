"use client";

import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { ReactNode } from "react";

const fontSans = localFont({ src: "../assets/fonts/MinecraftTen-VGORe.ttf" });

type ILabelCustomProps = {
  className?: string;
  children: ReactNode;
};

export default function LabelCustom({
  children,
  className,
}: ILabelCustomProps) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #FBC350 0%, #F6501B 100%)",
        backgroundClip: "text",
      }}
      className={cn(fontSans.className, "text-transparent font-bold", className)}
    >
      {children}
    </div>
  );
}
