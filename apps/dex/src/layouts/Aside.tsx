import clsx from "clsx";
import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Logo } from "@sifchain/ui";

const ENV = process.env.APP_ENV ?? "BETANET";

const Aside = () => {
  const [isOpen, setOpen] = useState(false);

  const handleBtn = (
    <button
      onClick={() => setOpen(!isOpen)}
      className={clsx(
        "h-8 w-8 p-1 rounded-r-md bg-slate-600 absolute top-1.5 right-0 translate-x-[100%]",
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
          "bg-slate-500 dark:bg-gray-900",
        ],
        {
          "-translate-x-[100%]": !isOpen,
          "md:block md:relative": isOpen,
        },
      )}
    >
      {handleBtn}
      <div className="w-full grid place-items-center p-8 pt-24">
        <Logo />
        <span>{ENV}</span>
      </div>
    </aside>
  );
};

export default Aside;
