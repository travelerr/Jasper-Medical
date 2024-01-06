import React from "react";
import PatientDataContext from "./PatientDataContext";
import { FullPatientProfile } from "../definitions";

const PatientDataProvider = ({
  patient,
  children,
}: {
  patient: FullPatientProfile;
  children: any;
}) => {
  return (
    <PatientDataContext.Provider value={patient}>
      {children}
    </PatientDataContext.Provider>
  );
};

export default PatientDataProvider;
