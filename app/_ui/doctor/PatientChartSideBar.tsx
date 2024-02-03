import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  covertPascalCase,
  formatPatientDob,
  formatPatientName,
} from "@/app/_lib/utils";
import { useContext, useEffect } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { FaUserDoctor, FaAddressCard } from "react-icons/fa6";
import { Sex } from "@prisma/client";
import { IoMale, IoFemale, IoMaleFemale, IoMedical } from "react-icons/io5";
import PatientNextAndLastAppointentComponent from "./PatientNextAndLastAppointentComponent";
import PatientAllergy from "./allergy/PatientAllergy";
import PatientDrugIntolerances from "./drug-intolerance/PatientDrugIntolerances";
import PatientProblemList from "./problem-list/PatientProblemList";
import PatientHistory from "./history/PatientHistory";

export default function PatientChartSideBar() {
  const { patient } = useContext(PatientDataContext);

  useEffect(() => {}, [patient]);

  function renderSexSymbol() {
    if (!patient.sexAtBirth) return <IoMaleFemale />;
    switch (patient.sexAtBirth) {
      case Sex.Female:
        return <IoFemale />;
      case Sex.Male:
        return <IoMale />;
      case Sex.Intersex:
        return <IoMaleFemale />;
      case Sex.Unknown:
        return "";
      default:
        return "";
    }
  }

  return (
    <nav
      aria-label="Patient sidebar"
      className="w-64 h-screen border-r rounded-none shiny-light-blue-bg"
    >
      <div className="bg-gray-50 dark:bg-gray-800 h-full overflow-x-hidden overflow-y-auto px-3 py-4 rounded shiny-light-blue-bg">
        <div
          id="patient-sidebard-pesonal-info"
          className="flex items-center pb-2 border-b border-black"
        >
          <ImageWithFallback
            src={""}
            fallbackSrc="/profile-fallback.png"
            className="rounded-full w-34"
            alt={`${formatPatientName(patient)}'s profile picture`}
            width={28}
            height={28}
          />
          <div className="flex-1 w-64 ml-3">
            <div className="font-bold">{formatPatientName(patient)}</div>
            <div>{formatPatientDob(patient.dob)}</div>
          </div>
        </div>
        <div
          id="patient-sidebard-medical-info"
          className="py-2 border-b border-black"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-2">
              <div>
                <FaUserDoctor />
              </div>
              <small>
                {patient.provider?.pcp ? (
                  patient.provider?.pcp
                ) : (
                  <button className="bg-green-500 border-2 border-green-500 p-1 rounded text-white">
                    Add PCP{" "}
                  </button>
                )}
              </small>
            </div>
            <div className="flex gap-2">
              <div>{renderSexSymbol()}</div>
              <small>
                {patient.sexAtBirth ? (
                  patient.sexAtBirth
                ) : (
                  <button className="bg-green-500 border-2 border-green-500 p-1 rounded text-white">
                    Add Sex
                  </button>
                )}
              </small>
            </div>
            <div className="flex gap-2">
              <div>
                <FaAddressCard />
              </div>
              <small>
                {patient.insurance?.insuanceName ? (
                  patient.insurance?.insuanceName
                ) : (
                  <button className="bg-green-500 border-2 border-green-500 p-1 rounded text-white">
                    Add Ins
                  </button>
                )}
              </small>
            </div>
            <div className="flex gap-2">
              <div>
                <IoMedical />
              </div>
              <small>
                {patient.pronouns ? (
                  covertPascalCase(patient.pronouns)
                ) : (
                  <button className="bg-green-500 border-2 border-green-500 p-1 rounded text-white">
                    Add Pro
                  </button>
                )}
              </small>
            </div>
          </div>
        </div>
        <div id="patient-sidebard-upcoming-apt" className="pt-2">
          <div className="grid grid-cols-2 gap-2"></div>
          {patient && (
            <PatientNextAndLastAppointentComponent
              appointments={patient.appointments}
            />
          )}
        </div>
        <div id="patient-sidebard-allergy" className="pt-2">
          <div className="grid grid-cols-2 gap-2"></div>
          {patient && <PatientAllergy allergies={patient.allergy} />}
        </div>
        <div id="patient-sidebard-allergy" className="pt-2">
          <div className="grid grid-cols-2 gap-2"></div>
          {patient && (
            <PatientDrugIntolerances intolerances={patient.drugIntolerance} />
          )}
        </div>
        <div id="patient-sidebard-problem-list" className="pt-2">
          <div className="grid grid-cols-2 gap-2"></div>
          {patient && <PatientProblemList problemList={patient.problemList} />}
        </div>
        <div id="patient-sidebard-problem-list" className="pt-2">
          <div className="grid grid-cols-2 gap-2"></div>
          {patient && (
            <PatientHistory patientHistory={patient.patientHistory} />
          )}
        </div>
      </div>
    </nav>
  );
}
