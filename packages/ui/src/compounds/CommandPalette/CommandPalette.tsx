import {
  ComponentProps,
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { FolderIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import tw from "tailwind-styled-components";

export type CommandPaletteEntry = {
  id: string;
  label: string;
  categoryId?: string;
  url?: string;
};

export type CommandPaletteCategory = {
  id: string;
  label: string;
  icon: (props: ComponentProps<"svg">) => JSX.Element;
};

export type QuickActionEntry = {
  label: string;
  shortcut: string;
  url?: string;
  icon: (props: ComponentProps<"svg">) => JSX.Element;
};

export type CommandPaletteProps = {
  query: string;
  placeholder?: string;
  onQueryChange(query: string): void;
  categories: { id: string; label: string }[];
  entries: CommandPaletteEntry[];
  quickActions: QuickActionEntry[];
  /**
   * used for persisting recent queries to sessionStorage
   */
  storageKey: string;
  className?: string;
  value: string;
  onChange(value: string): void;
};

function useBrowserStorages() {
  const [storages, setStorages] = useState<{
    localStorage: Storage;
    sessionStorage: Storage;
  }>();

  return {
    ...(storages ?? {}),
  };
}

export function useRecentEntries<TAdapter extends Storage>(
  initialState: CommandPaletteEntry[],
  storageOptions: {
    key: string;
    adapter: "localStorage" | "sessionStorage" | TAdapter;
  },
) {
  const [state, setState] = useState(initialState ?? []);

  const { localStorage, sessionStorage } = useBrowserStorages();

  const storageAdapter = useMemo(() => {
    switch (storageOptions.adapter) {
      case "localStorage":
        return localStorage;
      case "sessionStorage":
        return sessionStorage;
      default:
        return storageOptions.adapter;
    }
  }, []);

  useEffect(() => {
    const persisted = storageAdapter?.getItem(storageOptions.key);

    if (persisted) {
      const parsed = JSON.parse(persisted) as CommandPaletteEntry[];

      if (Array.isArray(parsed)) {
        setState(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (state.length) {
      storageAdapter?.setItem(storageOptions.key, JSON.stringify(state));
    }
  }, [state]);

  const handleAddEntry = useCallback((newEntry: CommandPaletteEntry) => {
    setState((prevEntries) => [newEntry, ...prevEntries.slice(0, 9)]);
  }, []);

  return [state, handleAddEntry] as const;
}

const TwSearchIcon = tw(SearchIcon)`
  pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-sifgray-300
`;

export const CommandPalette: FC<CommandPaletteProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [recents, addRecent] = useRecentEntries([], {
    key: "recent-entries",
    adapter: "localStorage",
  });

  const filteredEntries = useMemo(
    () =>
      props.query === ""
        ? []
        : props.entries.filter((entry) => {
            return entry.label
              .toLowerCase()
              .includes(props.query.toLowerCase());
          }),
    [props.query, props.entries],
  );

  const inputClassName = clsx(
    "h-12 w-full border-0 bg-transparent pl-11 pr-4",
    "text-white placeholder-sifgray-300 focus:ring-0 sm:text-sm",
  );

  return (
    <>
      <label
        className={clsx("block relative transition-opacity", props.className, {
          hidden: isOpen,
        })}
        aria-hidden={!isOpen}
      >
        <TwSearchIcon aria-hidden="true" />
        <input
          className={clsx(
            inputClassName,
            "!border-sifgray-700 !bg-sifgray-750 !text-sifgray-50 rounded-xl",
          )}
          placeholder={props.placeholder}
          onClick={setIsOpen.bind(null, true)}
        />
      </label>
      <Transition.Root
        show={isOpen}
        as={Fragment}
        afterLeave={props.onQueryChange.bind(null, "")}
        appear
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setIsOpen.bind(null, false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <label className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <label className="fixed inset-0 z-10 overflow-y-auto p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-sifgray-900 shadow-2xl transition-all">
                <Combobox onChange={props.onChange} value={props.value}>
                  <label className="relative">
                    <TwSearchIcon className="top-0" aria-hidden="true" />
                    <Combobox.Input
                      className={inputClassName}
                      placeholder={props.placeholder}
                      onChange={(event) =>
                        props.onQueryChange(event.target.value)
                      }
                    />
                  </label>

                  {(props.query === "" || filteredEntries.length > 0) && (
                    <Combobox.Options
                      static
                      className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                    >
                      <li className="p-2">
                        {props.query === "" && (
                          <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-sifgray-50">
                            Recent searches
                          </h2>
                        )}
                        <ul className="text-sm text-gray-400">
                          {(props.query === "" ? recents : filteredEntries).map(
                            (entry) => (
                              <Combobox.Option
                                key={entry.id}
                                value={entry}
                                className={({ active }) =>
                                  clsx(
                                    "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                    active && "bg-gray-800 text-white",
                                  )
                                }
                              >
                                {({ active }) => (
                                  <>
                                    <FolderIcon
                                      className={clsx(
                                        "h-6 w-6 flex-none",
                                        active
                                          ? "text-white"
                                          : "text-sifgray-300",
                                      )}
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 flex-auto truncate">
                                      {entry.label}
                                    </span>
                                    {active && (
                                      <span className="ml-3 flex-none text-gray-400">
                                        Jump to...
                                      </span>
                                    )}
                                  </>
                                )}
                              </Combobox.Option>
                            ),
                          )}
                        </ul>
                      </li>
                      {props.query === "" && (
                        <li className="p-2">
                          <h2 className="sr-only">Quick actions</h2>
                          <ul className="text-sm text-gray-400">
                            {props.quickActions.map((action) => (
                              <Combobox.Option
                                key={action.shortcut}
                                value={action}
                                className={({ active }) =>
                                  clsx(
                                    "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                    active && "bg-gray-800 text-white",
                                  )
                                }
                              >
                                {({ active }) => (
                                  <>
                                    <action.icon
                                      className={clsx(
                                        "h-6 w-6 flex-none",
                                        active
                                          ? "text-white"
                                          : "text-sifgray-300",
                                      )}
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 flex-auto truncate">
                                      {action.label}
                                    </span>
                                    <span className="ml-3 flex-none text-xs font-semibold text-gray-400">
                                      <kbd className="font-sans">⌘</kbd>
                                      <kbd className="font-sans">
                                        {action.shortcut}
                                      </kbd>
                                    </span>
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </ul>
                        </li>
                      )}
                    </Combobox.Options>
                  )}
                  {props.query !== "" && filteredEntries.length === 0 && (
                    <label className="py-14 px-6 text-center sm:px-14">
                      <FolderIcon
                        className="mx-auto h-6 w-6 text-sifgray-300"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-sm text-gray-200">
                        We couldn't find any entries with that term. Please try
                        again.
                      </p>
                    </label>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </label>
        </Dialog>
      </Transition.Root>
    </>
  );
};

CommandPalette.defaultProps = {
  placeholder: "Search tokens...",
};
