import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import { formatPatientDob, formatPatientName } from "@/app/_lib/utils";
import { Sidebar } from "flowbite-react";
import { useContext, useEffect } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { FaUserDoctor, FaAddressCard } from "react-icons/fa6";
import { FullPatientProfile } from "@/app/_lib/definitions";
import { Sex } from "@prisma/client";
import { IoMale, IoFemale, IoMaleFemale, IoMedical } from "react-icons/io5";
import PatientNextAndLastAppointentComponent from "./PatientNextAndLastAppointentComponent";
import PatientAllergy from "./PatientAllergy";
import ProblemList from "./ProblemList";

export default function PatientChartSideBar() {
  const patient: FullPatientProfile = useContext(PatientDataContext);

  useEffect(() => {}, [patient]);

  function renderSexSymbol() {
    if (!patient.sexAtBirth) return "";
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
    <Sidebar
      aria-label="Patient sidebar"
      className="h-screen border-r rounded-none"
    >
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
        className="pt-2 border-b border-black"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <div>
              <FaUserDoctor />
            </div>
            <small>{patient.provider?.pcp}</small>
          </div>
          <div className="flex gap-2">
            <div>{renderSexSymbol()}</div>
            <small>{patient.sexAtBirth}</small>
          </div>
          <div className="flex gap-2">
            <div>
              <FaAddressCard />
            </div>
            <small>{patient.insurance?.insuanceName}</small>
          </div>
          <div className="flex gap-2">
            <div>
              <IoMedical />
            </div>
            <small>{patient.gender}</small>
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
      <div id="patient-sidebard-problem-list" className="pt-2">
        <div className="grid grid-cols-2 gap-2"></div>
        {patient && <ProblemList problemList={patient.problemList} />}
      </div>
    </Sidebar>
  );
}
