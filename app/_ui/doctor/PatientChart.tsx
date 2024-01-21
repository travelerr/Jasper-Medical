import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import { useContext } from "react";
import PatientChartSideBar from "./PatientChartSideBar";

export default function PatientChart() {
  const { refetchPatientData, patient } = useContext(PatientDataContext);
  console.log("patient chart", patient);
  return (
    <div>
      <PatientChartSideBar />
    </div>
  );
}
