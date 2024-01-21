import React, { useEffect, useState } from "react";
import PatientDataContext from "./PatientDataContext";
import { FullPatientProfile } from "../definitions";
import { getFullPatientProfileById } from "../data";

const PatientDataProvider = ({
  patientProp,
  children,
}: {
  patientProp: FullPatientProfile;
  children: any;
}) => {
  const [patient, setPatient] = useState<FullPatientProfile>(patientProp);

  const refetchPatientData = async () => {
    try {
      const updatedPatientProfile = await getFullPatientProfileById(patient.id);
      setPatient(updatedPatientProfile);
    } catch (error) {
      console.error("Failed to fetch patient data:", error);
    }
  };
  return (
    <PatientDataContext.Provider value={{ patient, refetchPatientData }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export default PatientDataProvider;
