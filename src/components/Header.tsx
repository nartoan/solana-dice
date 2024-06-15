"use client";

import Image from "next/image";

import logo from "@/assets/img/logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full max-w-5xl flex items-center justify-between ">
      <Image src={logo}  alt={"logo"}></Image>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/about-us" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>About us</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/rules" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Rules</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
