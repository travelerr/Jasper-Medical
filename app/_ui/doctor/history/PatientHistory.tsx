import { FullPatientHistory } from "@/app/_lib/definitions";
import { PatientHistory } from "@prisma/client";
import {
  Accordion,
  AccordionPanel,
  AccordionTitle,
  AccordionContent,
} from "flowbite-react";
import PMH from "./PMH";
import PSH from "./PSH";

interface IPatientHistoryProps {
  patientHistory: PatientHistory & FullPatientHistory;
}

export default function PatientHistory(props: IPatientHistoryProps) {
  const { patientHistory } = props;

  return (
    <>
      <Accordion className="rounded-none" collapseAll>
        <AccordionPanel className="py-1 focus:outline-none rounded-none">
          <AccordionTitle className="text-black rounded-none">
            History
          </AccordionTitle>
          <AccordionContent className="p-1 bg-white rounded-none caret-accordion">
            <PMH
              pastMedicalHistory={patientHistory.pastMedicalHistory}
              patientHistoryId={patientHistory.id}
            />
            <PSH
              pastSurgicalHistory={patientHistory.pastSurgicalHistory}
              patientHistoryId={patientHistory.id}
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </>
  );
}
