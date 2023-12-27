import React, { createContext } from "react";
import PatientDataContext from "./PatientDataContext";

const PatientDataProvider = ({
  patient,
  children,
}: {
  patient: any;
  children: any;
}) => {
  // You can include more patient-related state and logic here as needed
  const patientData = { ...patient };

  return (
    <PatientDataContext.Provider value={patientData}>
      {children}
    </PatientDataContext.Provider>
  );
};

export default PatientDataProvider;
