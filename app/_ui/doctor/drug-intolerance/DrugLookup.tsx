"use client";

import { getDrugsTypeAhead } from "@/app/_lib/data";
import { Drug } from "@prisma/client";
import { Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface IDrugLookup {
  handleSelectedDrug: Function;
}

export default function DrugLookup(props: IDrugLookup) {
  const { handleSelectedDrug } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Drug[]>([]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm) {
        try {
          const response = await getDrugsTypeAhead(debouncedSearchTerm);
          setResults(response);
        } catch (error) {
          console.error("Error fetching drugs:", error);
        }
      } else {
        setResults([]);
      }
    };
    performSearch();
  }, [debouncedSearchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectedDrugFuncWrapper = (drug: Drug) => {
    setSearchTerm(`${drug.proprietaryName} - ${drug.nonProprietaryName}`);
    handleSelectedDrug(drug);
    setResults([]);
  };

  return (
    <div className="relative">
      <Label htmlFor="drugLookup" value="Drug lookup" />
      <input
        type="text"
        id="drugLookup"
        autoComplete="off"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search drugs..."
        className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <ul className="absolute bg-white w-full z-50">
        {searchTerm &&
          results.map((drug) => (
            <li className="border w-full" key={drug.id}>
              <button
                className="flex flex-col w-full p-1"
                onClick={() => handleSelectedDrugFuncWrapper(drug)}
              >
                {`${drug.proprietaryName}`} - {`${drug.nonProprietaryName}`}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
