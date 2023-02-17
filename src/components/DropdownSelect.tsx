import { titleCase } from "@/utils/format";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";

// external imports
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type DropdownSelectProps<TInputs extends FieldValues> = {
  control: Control<TInputs, any>;
  name: Path<TInputs>;
  options: string[];
};

const DropdownSelect = <TInputs extends FieldValues>({
  control,
  name,
  options,
}: DropdownSelectProps<TInputs>) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={selected as PathValue<TInputs, Path<TInputs>>}
      render={({ field: { onChange } }) => (
        <Listbox
          value={selected}
          onChange={(value) => {
            onChange(value);
            setSelected(value);
          }}
        >
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-400 bg-neutral-700 py-2 pl-4 pr-10 text-left text-base text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500">
              <span className="block truncate">
                {titleCase(selected as string)}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-200"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-neutral-700 py-1 text-sm shadow-lg ring-1 ring-gray-400 focus:outline-none">
                {options.map((option) => (
                  <Listbox.Option
                    key={option}
                    className="hover:ui-selected:bg-neutra-500 relative cursor-pointer select-none py-2 pl-10 pr-4 text-white transition hover:bg-neutral-500 ui-selected:bg-neutral-500/60"
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span className="block truncate font-normal ui-selected:font-medium">
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                          {titleCase(option)}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )}
    />
  );
};

export default DropdownSelect;
