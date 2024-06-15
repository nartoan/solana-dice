import Image from "next/image";

import logo from "@/assets/img/logo.png";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Image src={logo} alt={""}></Image>
        <div>
          <span>About us</span>
          <span>Rules</span>
        </div>
        <Button>Select wallet</Button>
      </div>
    </main>
  );
}
