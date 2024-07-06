import React, { useState, ReactNode } from "react";
import PatientDataContext from "./PatientDataContext";
import { FullPatientProfile } from "../definitions";
import { getFullPatientProfileById } from "../data";

interface PatientDataProviderProps {
  patientProp: FullPatientProfile;
  children: ReactNode;
}

const PatientDataProvider = ({
  patientProp,
  children,
}: PatientDataProviderProps) => {
  const [patient, setPatient] = useState<FullPatientProfile>(patientProp);

  const refetchPatientData = async () => {
    try {
      const updatedPatientProfile = await getFullPatientProfileById(patient.id);
      setPatient(updatedPatientProfile);
    } catch (error) {
      console.error("Failed to fetch patient data:", error);
    }
  };

  const updatePatientField = (field: keyof FullPatientProfile, value: any) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PatientDataContext.Provider
      value={{ patient, refetchPatientData, updatePatientField }}
    >
      {children}
    </PatientDataContext.Provider>
  );
};

export default PatientDataProvider;
