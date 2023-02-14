import { Combobox, Transition } from "@headlessui/react";
import type { HTMLAttributes } from "react";
import { Fragment, useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type SearchableSelectProps<TInputs extends FieldValues> = {
  control: Control<TInputs, any>;
  name: Path<TInputs>;
  options: string[];
} & HTMLAttributes<HTMLDivElement>;

const SearchableSelect = <TInputs extends FieldValues>({
  control,
  name,
  options,
}: SearchableSelectProps<TInputs>) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onChange } }) => (
        <Combobox
          value={selected}
          onChange={(value) => {
            setSelected(value);
            onChange(value);
          }}
        >
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border-gray-400 bg-neutral-800 px-4 py-2.5 text-white placeholder:text-gray-400"
              placeholder="Search for a country..."
              onChange={(event) => setQuery(event.target.value)}
            />
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-gray-400 focus:outline-none">
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-white">
                    Nothing found.
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option}
                      className="relative cursor-default select-none bg-neutral-800 py-2 px-4 text-white ui-active:bg-neutral-700"
                      value={option}
                    >
                      <span>{option}</span>
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      )}
    />
  );
};

export default SearchableSelect;
