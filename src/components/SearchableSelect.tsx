import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type SearchableSelectProps<TInputs extends FieldValues> = {
  control: Control<TInputs, any>;
  name: Path<TInputs>;
  options: string[];
};

const SearchableSelect = <TInputs extends FieldValues>({
  control,
  name,
  options,
}: SearchableSelectProps<TInputs>) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const comboButtonRef = useRef<HTMLButtonElement>(null);

  const filteredOptions =
    query === ""
      ? options
      : options
          .filter((option) =>
            option.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: true,
        validate: (value) => value !== null,
      }}
      render={({ field: { onChange } }) => (
        <Combobox
          value={selected}
          onChange={(value) => {
            setSelected(value);
            onChange(value);
          }}
        >
          <div className="relative mt-1">
            <Combobox.Button className="sr-only" ref={comboButtonRef}>
              Combobox button
            </Combobox.Button>
            <Combobox.Input
              className="w-full rounded-md border-gray-400 bg-neutral-700 px-4 py-2.5 text-white placeholder:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Search for a country..."
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                if (!comboButtonRef.current) return;
                comboButtonRef.current.click();
              }}
              autoComplete="off"
            />
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options
                static
                className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-md bg-neutral-700 py-1 text-sm shadow-lg ring-1 ring-gray-400 focus:outline-none"
              >
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-white">
                    Nothing found.
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option}
                      className="relative cursor-default select-none bg-neutral-700 py-2 px-4 text-white ui-active:bg-neutral-500"
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
