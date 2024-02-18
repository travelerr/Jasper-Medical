"use client";

import { getPatientsTypeAhead } from "@/app/_lib/data";
import { formatDateString } from "@/app/_lib/utils";
import { Patient } from "@prisma/client";
import { Label } from "flowbite-react";
import { useState } from "react";

interface IPatientLookup {
  callback: Function;
  limit?: number;
}

export default function PatientLookup(props: IPatientLookup) {
  const { callback, limit } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: any) => {
    setSearchTerm(event.target.value);
    setIsLoading(true);
    const response = await getPatientsTypeAhead(`${event.target.value}`, limit);
    setResults(response);
    setIsLoading(false);
  };
  return (
    <div className="relative">
      <Label htmlFor="patientLookup" value="Patient lookup" />
      <input
        type="text"
        id="patientLookup"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search patients..."
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {/* {isLoading && <div>Loading...</div>} */}
      <ul className="bg-white absolute w-full z-10">
        {searchTerm &&
          results.map((patient) => (
            <li className="border w-full" key={patient.id}>
              <button
                className="flex flex-col w-full p-1"
                onClick={() => callback(patient)}
              >
                {`${patient.firstName} ${patient.lastName}`}
                <small>
                  <span>DOB: </span>
                  <span className="font-bold">{`${formatDateString(
                    patient.dob.toDateString()
                  )}`}</span>
                </small>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
