import { FC, Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import {
  DocumentAddIcon,
  FolderAddIcon,
  FolderIcon,
  HashtagIcon,
  TagIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";

const projects = [
  { id: 1, name: "Workflow Inc. / Website Redesign", url: "#" },
  // More projects...
];
const recent = [projects[0]];
const quickActions = [
  { name: "Add new file...", icon: DocumentAddIcon, shortcut: "N", url: "#" },
  { name: "Add new folder...", icon: FolderAddIcon, shortcut: "F", url: "#" },
  { name: "Add hashtag...", icon: HashtagIcon, shortcut: "H", url: "#" },
  { name: "Add label...", icon: TagIcon, shortcut: "L", url: "#" },
];

export type CommandPaletteProps = JSX.IntrinsicElements["div"];

export const CommandPalette: FC = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredProjects =
    query === ""
      ? []
      : projects.filter((project) => {
          return project.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <label
        className={clsx("relative transition-opacity", {
          hidden: isOpen,
        })}
        aria-hidden={!isOpen}
      >
        <SearchIcon
          className="pointer-events-none absolute top-0 left-4 h-5 w-5 text-sifgray-300"
          aria-hidden="true"
        />
        <input
          className={clsx(
            "h-12 w-full border border-sifgray-700 bg-sifgray-750 pl-11 pr-4 text-sifgray-50",
            "placeholder-gray-500 placeholder:text-sifgray-300 focus:ring-0 sm:text-sm rounded-md",
          )}
          placeholder="Search..."
          onClick={setIsOpen.bind(null, true)}
        />
      </label>
      <Transition.Root
        show={isOpen}
        as={Fragment}
        afterLeave={() => setQuery("")}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
                <Combobox onChange={() => {}} value={""}>
                  <div className="relative">
                    <SearchIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-sifgray-300"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>

                  {(query === "" || filteredProjects.length > 0) && (
                    <Combobox.Options
                      static
                      className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                    >
                      <li className="p-2">
                        {query === "" && (
                          <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">
                            Recent searches
                          </h2>
                        )}
                        <ul className="text-sm text-gray-400">
                          {(query === "" ? recent : filteredProjects).map(
                            (project) => (
                              <Combobox.Option
                                key={project.id}
                                value={project}
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
                                      {project.name}
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
                      {query === "" && (
                        <li className="p-2">
                          <h2 className="sr-only">Quick actions</h2>
                          <ul className="text-sm text-gray-400">
                            {quickActions.map((action) => (
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
                                      {action.name}
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

                  {query !== "" && filteredProjects.length === 0 && (
                    <div className="py-14 px-6 text-center sm:px-14">
                      <FolderIcon
                        className="mx-auto h-6 w-6 text-sifgray-300"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-sm text-gray-200">
                        We couldn't find any projects with that term. Please try
                        again.
                      </p>
                    </div>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
