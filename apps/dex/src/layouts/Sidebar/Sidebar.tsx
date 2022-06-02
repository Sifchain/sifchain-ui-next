import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon, MoonIcon } from "@heroicons/react/outline";
import { useConnect as useCosmConnect } from "@sifchain/cosmos-connect";
import { Logo, ThemeSwitcher } from "@sifchain/ui";
import { formatNumberAsCurrency } from "@sifchain/ui/src/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useState } from "react";
import {
  useConnect as useEtherConnect,
  useDisconnect as useEtherDisconnect,
} from "wagmi";
import GlobalSearch from "~/compounds/GlobalSearch";
import { useRowanPriceQuery, useTVLQuery } from "~/domains/clp/hooks";

const ENV = process.env["APP_ENV"] ?? "betanet";

export const MENU_ITEMS = [
  {
    title: "Swap",
    href: "/swap",
    icon: require("@sifchain/ui/assets/icons/swap-icon.svg"),
  },
  {
    title: "Balance",
    href: "/balances",
    icon: require("@sifchain/ui/assets/icons/balance-icon.svg"),
  },
  {
    title: "Pools",
    href: "/pools",
    icon: require("@sifchain/ui/assets/icons/pools-icon.svg"),
  },
  {
    title: "Changelog",
    href: "/changelog",
    icon: require("@sifchain/ui/assets/icons/changelog-icon.svg"),
  },
];

const Aside = () => {
  const [isOpen, setOpen] = useState(true);
  const currentPath = useRouter().asPath;

  const handleBtn = (
    <button
      onClick={() => setOpen(!isOpen)}
      className={clsx(
        "h-8 w-8 p-1 rounded-r-md bg-slate-600 absolute top-1.5 sm:top-16 right-0 translate-x-[90%]",
        "transition-transform z-30 md:hidden opacity-50 hover:opacity-100",
        {
          "-translate-x-0 bg-white -scale-x-[1] text-gray-900": isOpen,
        },
      )}
    >
      <ChevronRightIcon />
    </button>
  );

  const { data: TVL, isLoading: isLoadingTVL } = useTVLQuery();
  const { data: rowanPrice, isLoading: isLoadingRowanPrice } =
    useRowanPriceQuery();

  const rowanStats = [
    {
      id: "tvl",
      icon: require("@sifchain/ui/assets/icons/lock-icon.svg"),
      label: <>{isLoadingTVL ? "..." : formatNumberAsCurrency(TVL)} TVL</>,
    },
    {
      id: "price",
      icon: require("@sifchain/ui/assets/icons/rowan-icon.svg"),
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
    <aside
      className={clsx(
        [
          "fixed w-full md:max-w-[280px] h-screen transition-transform ease",
          "bg-sifgray-900 p-4 sm:shadow-lg shadow-slate-900",
        ],
        {
          "-translate-x-[100%]": !isOpen,
          "md:sticky md:top-0": isOpen,
        },
      )}
    >
      <div className="flex flex-col gap-8 h-full">
        {handleBtn}
        <section className="w-full grid place-items-center py-8 md:py-10 gap-2">
          <Link href="/">
            <a className="flex items-center">
              <Logo />
            </a>
          </Link>
          <span className="text-white font-mono uppercase">{ENV}</span>
        </section>
        <section>
          <GlobalSearch />
        </section>
        <section>
          <WalletButton />
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
                        "flex items-center gap-4 p-2 hover:bg-sifgray-800 hover:opacity-80 rounded-md transition-all",
                        {
                          "bg-sifgray-600": currentPath === href,
                        },
                      )}
                    >
                      <span className="h-6 w-6 grid place-items-center">
                        <Image alt={title} src={icon} />
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
        <section className="grid gap-2 md:gap-4">
          <ul className="grid">
            {rowanStats.map(({ id, icon, label }) => (
              <li key={id} className="flex items-center gap-3 p-2">
                <span className="h-6 w-6 grid place-items-center">
                  <Image alt={id} src={icon} />
                </span>
                <span className="text-sifgray-200 font-semibold text-sm tracking-widest">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <label
            className="flex items-center justify-between p-2"
            role="button"
          >
            <div className="flex items-center gap-3">
              <span className="grid place-items-center text-sifgray-50">
                <MoonIcon className="h-6 w-6 scale-90 origin-center" />
              </span>
              <span className="text-sifgray-200 font-semibold text-sm tracking-widest">
                Dark mode
              </span>
            </div>
            <ThemeSwitcher />
          </label>
          <div className="text-center text-sm text-sifgray-300 font-mono p-1">
            v2.2.105 © {new Date().getFullYear()} Sifchain
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Aside;

const WalletButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <button
        onClick={useCallback(() => setIsModalVisible(true), [])}
        className="p-4 rounded-lg transition-opacity opacity-80 hover:opacity-100 bg-slate-200 text-gray-900 font-semibold w-full"
      >
        Manage Wallet Connections
      </button>
      <WalletChooserModal
        visible={isModalVisible}
        onCloseRequest={useCallback(() => setIsModalVisible(false), [])}
      />
    </>
  );
};

const CosmConnectButtons = () => {
  const { connectors, activeConnector, connect, isConnected, disconnect } =
    useCosmConnect();

  return (
    <>
      {isConnected ? (
        <button
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onClick={() => disconnect(activeConnector!)}
          className="p-4 rounded-lg transition-opacity opacity-80 hover:opacity-100 bg-slate-200 text-gray-900 font-semibold w-full"
        >
          Disconnect Cosmos Wallet
        </button>
      ) : (
        connectors.map((x) => (
          <button
            key={x.id}
            onClick={() => connect(x)}
            className="p-4 rounded-lg transition-opacity opacity-80 hover:opacity-100 bg-slate-200 text-gray-900 font-semibold w-full"
          >
            Connect Cosmos {x.name}
          </button>
        ))
      )}
    </>
  );
};

const EtherConnectButtons = () => {
  const { connectors, connect, isConnected } = useEtherConnect();
  const { disconnect } = useEtherDisconnect();

  return (
    <>
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="p-4 rounded-lg transition-opacity opacity-80 hover:opacity-100 bg-slate-200 text-gray-900 font-semibold w-full"
        >
          Disconnect Ethereum Wallet
        </button>
      ) : (
        connectors.map((x) => (
          <button
            key={x.id}
            onClick={() => connect(x)}
            className="p-4 rounded-lg transition-opacity opacity-80 hover:opacity-100 bg-slate-200 text-gray-900 font-semibold w-full"
          >
            Connect Eth {x.name}
          </button>
        ))
      )}
    </>
  );
};

const WalletChooserModal = (props: {
  visible: boolean;
  onCloseRequest: () => unknown;
}) => {
  return (
    <Transition appear show={props.visible} as={Fragment}>
      <Dialog onClose={props.onCloseRequest}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Backdrop className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <CosmConnectButtons />
                <EtherConnectButtons />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
