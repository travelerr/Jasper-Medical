"use client";

import { getAllergensTypeAhead } from "@/app/_lib/data";
import { Allergen } from "@prisma/client";
import { Label } from "flowbite-react";
import { useState } from "react";

interface IAllergenLookup {
  handleSelectedAllergen: Function;
  register: any;
}

export default function AllergenLookup(props: IAllergenLookup) {
  const { handleSelectedAllergen, register } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: any) => {
    setSearchTerm(event.target.value);
    setIsLoading(true);
    const response = await getAllergensTypeAhead(`${event.target.value}`);
    setResults(response);
    setIsLoading(false);
  };
  return (
    <div>
      <Label htmlFor="allergenLookup" value="Allergen lookup" />
      <input
        type="text"
        id="allergenLookup"
        value={searchTerm}
        onChange={handleSearch}
        {...register}
        placeholder="Search allergens..."
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {isLoading && <div>Loading...</div>}
      <ul>
        {searchTerm &&
          results.map((allergen) => (
            <li className="border w-full" key={allergen.id}>
              <button
                className="flex flex-col w-full p-1"
                onClick={() => handleSelectedAllergen(allergen)}
              >
                {`${allergen.name}`}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
