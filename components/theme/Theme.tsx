"use client";

import React from "react";
import Image from "next/image";

// import { useTheme } from "@/context/ThemeProvider";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { themes } from "@/constants";
import { useTheme } from "./ThemeProvider";

const Theme = () => {
  const { mode, setMode } = useTheme();

  return (
    <Menubar className="relative rounded-full border-none bg-transparent  shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer bg-transparent active:bg-transparent">
          {mode === "light" ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="sun"
              width={20}
              height={20}
              className=""
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="moon"
              width={20}
              height={20}
              className=""
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-2 min-w-[120px] rounded-xl border py-2">
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              onClick={() => {
                setMode(item.value);

                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
              className="flex items-center gap-4 px-2.5 py-2"
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && "active-theme"}`}
              />
              <p className="font-semibold">{item.label}</p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
