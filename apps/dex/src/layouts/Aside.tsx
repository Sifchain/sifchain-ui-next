import clsx from "clsx";
import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Logo } from "@sifchain/ui";

const ENV = process.env.APP_ENV ?? "betanet";

const Aside = () => {
  const [isOpen, setOpen] = useState(false);

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
          "bg-gray-900 p-4",
        ],
        {
          "-translate-x-[100%]": !isOpen,
          "md:block md:relative": isOpen,
        },
      )}
    >
      {handleBtn}
      <section className="w-full grid place-items-center p-8 pt-24 gap-2">
        <Logo />
        <span className="text-white font-mono uppercase">{ENV}</span>
      </section>
      <section>
        <ConnectButton />
      </section>
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
