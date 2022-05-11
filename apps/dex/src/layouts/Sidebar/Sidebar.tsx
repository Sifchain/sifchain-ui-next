import { ChevronRightIcon } from "@heroicons/react/outline";
import { Logo } from "@sifchain/ui";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

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
        "transition-transform",
        {
          "translate-x-0 bg-white -scale-x-[1] text-gray-900": isOpen,
        },
      )}
    >
      <ChevronRightIcon />
    </button>
  );

  return (
    <aside
      className={clsx(
        [
          "fixed w-full md:max-w-xs h-screen transition-transform ease",
          "bg-gray-900 p-4 sm:shadow-lg shadow-slate-900",
        ],
        {
          "-translate-x-[100%]": !isOpen,
          "md:block md:relative": isOpen,
        },
      )}
    >
      <div className="grid gap-8">
        {handleBtn}
        <section className="w-full grid place-items-center py-8 md:py-10 gap-2">
          <Logo />
          <span className="text-white font-mono uppercase">{ENV}</span>
        </section>
        <section>
          <ConnectButton />
        </section>
        <nav>
          <ul className="grid gap-2">
            {MENU_ITEMS.map(({ title, href, icon }) => (
              <li key={title} className="grid gap-2">
                <Link href={href}>
                  <a
                    role="navigation"
                    className={clsx(
                      "flex items-center gap-4 p-2 hover:bg-slate-800 rounded-md",
                      {
                        "bg-gray-800": currentPath === href,
                      },
                    )}
                  >
                    <Image src={icon} className="h-6 w-6" />
                    <span className="text-white font-semibold">{title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
