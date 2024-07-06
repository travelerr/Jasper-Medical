import { createContext, useContext } from "react";
import { FullPatientProfile } from "../definitions";

interface PatientDataContextType {
  patient: FullPatientProfile | null;
  refetchPatientData: () => Promise<void>;
  updatePatientField: (field: keyof FullPatientProfile, value: any) => void;
}

// Create the context with a default value of null
const PatientDataContext = createContext<PatientDataContextType | null>(null);

export const usePatientDataContext = () => useContext(PatientDataContext);

export default PatientDataContext;
