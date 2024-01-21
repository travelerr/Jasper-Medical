"use client";

import { getDrugsTypeAhead, getICD10CodesTypeAhead } from "@/app/_lib/data";
import { Drug, ICD10Code } from "@prisma/client";
import { Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface IICD10CodeLookup {
  handleSelectedICD10Code: Function;
}

export default function ICD10CodeLookup(props: IICD10CodeLookup) {
  const { handleSelectedICD10Code } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ICD10Code[]>([]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm) {
        try {
          const response = await getICD10CodesTypeAhead(debouncedSearchTerm);
          setResults(response);
        } catch (error) {
          console.error("Error fetching ICD10Codes:", error);
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

  const handleSelectedICD10CodeFuncWrapper = (icd10Code: ICD10Code) => {
    setSearchTerm("");
    handleSelectedICD10Code(icd10Code);
    setResults([]);
  };

  return (
    <div className="relative">
      <Label htmlFor="icd10CodeLookup" value="ICD10 Code Lookup" />
      <input
        type="text"
        id="icd10CodeLookup"
        autoComplete="off"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search ICD10 Codes..."
        className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <div>
        {results.length > 0 ? (
          <div className="flex w-full border p-1">
            <div className="w-11/12 font-bold">Diagnosis</div>
            <div className="w-1/12 font-bold">ICD10</div>
          </div>
        ) : null}
        <ul className="absolute bg-white w-full z-50 max-h-60 overflow-y-auto ">
          {searchTerm &&
            results.map((code) => (
              <li className="border w-full" key={code.id}>
                <button
                  className="flex flex-col w-full p-1"
                  onClick={() => handleSelectedICD10CodeFuncWrapper(code)}
                >
                  <div className="flex w-full text-left">
                    <div className="w-11/12">{code.shortDescription}</div>
                    <div className="w-1/12">{code.code}</div>
                  </div>
                </button>
              </li>
            ))}
          {results.length > 0 ? (
            <li className="flex w-full border p-1 italic">
              {`Showing top ${results.length} results`}
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
