"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import LabelCustom from "@/components/ui-custom/label-custom";
import logo from "@/assets/img/logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  { title: "About", link: "/about", isDisable: false },
  { title: "Roadmap", link: "/roadmap", isDisable: false },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-5xl flex items-center justify-between ">
      <Link href="/">
        <Image src={logo} alt={"logo"} />
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {routes.map(({ title, link }, index) => {
            const isActive = pathname === link;

            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle())}
                  active={isActive}
                  asChild
                >
                  <Link
                    href={link}
                    className="data-[active]:border-b-2 data-[active]:bg-inherit data-[active]:rounded-none"
                  >
                    <div
                      className={`text-[24px]`}
                    >
                      <LabelCustom>{title}</LabelCustom>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
