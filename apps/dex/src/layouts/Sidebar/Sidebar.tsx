import { ChevronRightIcon } from "@heroicons/react/outline";
import { Logo } from "@sifchain/ui";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { formatNumberAsCurrency } from "~/lib/formatters";

const ENV = process.env.APP_ENV ?? "betanet";

export const MENU_ITEMS = [
  {
    title: "Swap",
    href: "/swap",
    icon: require("~/assets/icons/swap-icon.svg"),
  },
  {
    title: "Balance",
    href: "/balances",
    icon: require("~/assets/icons/balance-icon.svg"),
  },
  {
    title: "Pools",
    href: "/pools",
    icon: require("~/assets/icons/pools-icon.svg"),
  },
  {
    title: "Changelog",
    href: "/changelog",
    icon: require("~/assets/icons/changelog-icon.svg"),
  },
];

const Aside = () => {
  const [isOpen, setOpen] = useState(true);
  const currentPath = useRouter().asPath;

  const handleBtn = (
    <button
      onClick={() => setOpen(!isOpen)}
      className={clsx(
        "h-8 w-8 p-1 rounded-r-md bg-slate-600 absolute top-1.5 sm:top-16 right-0 translate-x-[100%]",
        "transition-transform md:hidden",
        {
          "translate-x-0 bg-white -scale-x-[1] text-gray-900": isOpen,
        },
      )}
    >
      <ChevronRightIcon />
    </button>
  );

  const rowanStats = [
    {
      id: "tvl",
      icon: require("~/assets/icons/lock-icon.svg"),
      label: <>{formatNumberAsCurrency(999999999)} TVL</>,
    },
    {
      id: "price",
      icon: require("~/assets/icons/rowan-icon.svg"),
      label: <>{formatNumberAsCurrency(0.99)} / ROWAN</>,
    },
  ];

  return (
    <aside
      className={clsx(
        [
          "fixed w-full md:max-w-xs h-screen transition-transform ease",
          "bg-sifgray-900 p-4 sm:shadow-lg shadow-slate-900",
        ],
        {
          "-translate-x-[100%]": !isOpen,
          "md:block md:relative": isOpen,
        },
      )}
    >
      <div className="flex flex-col gap-8 h-full">
        {handleBtn}
        <section className="w-full grid place-items-center py-8 md:py-10 gap-2">
          <Logo />
          <span className="text-white font-mono uppercase">{ENV}</span>
        </section>
        <section>
          <ConnectButton />
        </section>
        <section className="flex flex-1">
          <nav className="w-full">
            <ul className="grid gap-2">
              {MENU_ITEMS.map(({ title, href, icon }) => (
                <li key={title} className="grid gap-2">
                  <Link href={href}>
                    <a
                      role="navigation"
                      className={clsx(
                        "flex items-center gap-4 p-2 hover:bg-sifgray-600 rounded-md",
                        {
                          "bg-sifgray-800": currentPath === href,
                        },
                      )}
                    >
                      <span className="h-6 w-6 grid place-items-center">
                        <Image src={icon} />
                      </span>
                      <span className="text-sifgray-200 font-semibold text-sm">
                        {title}
                      </span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        <section>
          <ul>
            {rowanStats.map(({ id, icon, label }) => (
              <li
                key={id}
                className="flex flex-row items-center gap-2 tracking-widest p-2"
              >
                <span className="h-6 w-6 grid place-items-center mr-1">
                  <Image src={icon} />
                </span>
                <span className="text-sifgray-200 font-semibold text-sm">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
};

export default Aside;

function ConnectButton({}) {
  return (
    <button className="p-4 rounded-lg transition-opacity opacity-80 hover:opacity-100 bg-slate-200 text-gray-900 font-semibold w-full">
      Connect Wallets
    </button>
  );
}
