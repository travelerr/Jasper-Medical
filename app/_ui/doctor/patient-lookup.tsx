"use client";

import { getPatientsTypeAhead } from "@/app/_lib/data";
import { Label } from "flowbite-react";
import { useState } from "react";

interface IPatientLookup {}

export default function PatientLookup(props: IPatientLookup) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: any) => {
    setSearchTerm(event.target.value);
    setIsLoading(true);
    const response = await getPatientsTypeAhead(`${event.target.value}`);
    console.log(response);
    setResults(response);
    setIsLoading(false);
  };
  return (
    <div>
      <Label htmlFor="patientLookup" value="Patient lookup" />
      <input
        type="text"
        id="patientLookup"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search patients..."
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {isLoading && <div>Loading...</div>}
      <ul>
        {results.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
}
