import {
  BalanceIcon,
  ChangelogIcon,
  formatNumberAsCurrency,
  LockIcon,
  LogoFull,
  PoolsIcon,
  RowanIcon,
  SwapIcon,
  PlusIcon,
} from "@sifchain/ui";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import WalletConnector from "~/compounds/WalletConnector";
import { useRowanPriceQuery, useTVLQuery } from "~/domains/clp/hooks";

export const MENU_ITEMS = [
  {
    title: "Swap",
    href: "/swap",
    icon: <SwapIcon />,
  },
  {
    title: "Balance",
    href: "/balances",
    icon: <BalanceIcon />,
  },
  {
    title: "Margin",
    href: "/margin",
    icon: <PlusIcon />,
  },
  {
    title: "Pools",
    href: "/pools",
    icon: <PoolsIcon />,
  },
  {
    title: "Changelog",
    href: "/changelog",
    icon: <ChangelogIcon />,
  },
];

const Header = () => {
  const router = useRouter();
  const currentPath = router.asPath;

  const { data: TVL, isLoading: isLoadingTVL } = useTVLQuery();
  const { data: rowanPrice, isLoading: isLoadingRowanPrice } =
    useRowanPriceQuery();

  const rowanStats = [
    {
      id: "tvl",
      icon: <LockIcon />,
      label: <>{isLoadingTVL ? "..." : formatNumberAsCurrency(TVL)} TVL</>,
    },
    {
      id: "price",
      icon: <RowanIcon />,
      label: (
        <>
          {" "}
          {isLoadingRowanPrice ? "..." : formatNumberAsCurrency(rowanPrice)} /
          ROWAN
        </>
      ),
    },
  ];

  return (
    <header className="bg-black p-2 md:p-4 grid ">
      <div className="block md:flex md:items-center md:gap-8 justify-between">
        <section className="grid place-items-center">
          <Link href="/">
            <a className="p-8 md:p-0">
              <LogoFull className="h-24 md:h-12" />
            </a>
          </Link>
        </section>
        <nav className="w-full md:flex md:justify-center">
          <ul className="grid gap-2 md:flex md:gap-4 xl:gap-5 4xl:gap-8">
            {MENU_ITEMS.slice(0, 3).map(({ title, href, icon }) => (
              <li key={title} className="grid gap-2">
                <Link href={href}>
                  <a
                    role="navigation"
                    className={clsx(
                      "flex items-center gap-4 p-2 hover:bg-gray-800 hover:opacity-80 rounded-md transition-all",
                      {
                        "bg-gray-600": currentPath === href,
                      },
                    )}
                  >
                    <span className="h-6 w-6 grid place-items-center text-gray-50 md:hidden">
                      {icon}
                    </span>
                    <span className="text-gray-200 font-semibold text-sm">
                      {title}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
            <li>...</li>
          </ul>
        </nav>
        <section className="grid md:flex md:items-center gap-2 md:gap-4">
          <ul className="grid md:flex md:items-center gap-2">
            {rowanStats.map(({ id, icon, label }) => (
              <li key={id} className="flex items-center gap-3 p-2">
                <span className="h-6 w-6 grid place-items-center text-gray-50">
                  {icon}
                </span>
                <span className="text-gray-200 font-semibold text-xs tracking-widest">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="whitespace-nowrap">
          <WalletConnector />
        </section>
      </div>
    </header>
  );
};

export default Header;
