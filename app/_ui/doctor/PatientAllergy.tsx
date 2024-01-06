import { Allergy } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

interface IPatientAlleryProps {
  allergies: Allergy[];
}
export default function PatientAllery(props: IPatientAlleryProps) {
  const { allergies } = props;

  return (
    <>
      {allergies.length ? (
        <Accordion className="rounded-none" collapseAll>
          <AccordionPanel className="py-1 focus:outline-none">
            <AccordionTitle className="text-red-600">Allergies</AccordionTitle>
            <AccordionContent className="p-1 bg-white">
              {allergies.map((allergy, index) => (
                <div
                  key={allergy.id}
                  className={`flex flex-col ${
                    index !== allergies.length - 1
                      ? "border-b border-black"
                      : ""
                  }`}
                >
                  <small className="text-black">{allergy.name}</small>
                  <small className="text-black">{allergy.reaction}</small>
                  <small className="text-black">{allergy.severity}</small>
                </div>
              ))}
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      ) : (
        <span className="text-black italic">No allergies</span>
      )}
    </>
  );
}
