import { Allergy, Drug, DrugIntolerance } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";

interface IPatientDrugIntolerancesProps {
  intolerances: (DrugIntolerance & { drug: Drug })[];
}
export default function PatientDrugIntolerances(
  props: IPatientDrugIntolerancesProps
) {
  const { intolerances } = props;

  return (
    <>
      {intolerances.length ? (
        <Accordion className="rounded-none" collapseAll>
          <AccordionPanel className="py-1 focus:outline-none">
            <AccordionTitle className="text-red-600">
              Drug Intolerances
            </AccordionTitle>
            <AccordionContent className="p-1 bg-white">
              {intolerances.map((intolerance, index) => (
                <div
                  key={intolerance.id}
                  className={`flex flex-col ${
                    index !== intolerances.length - 1
                      ? "border-b border-black"
                      : ""
                  }`}
                >
                  <small className="text-black">
                    {intolerance.drug.proprietaryName}
                  </small>
                  <small className="text-black">
                    {intolerance.drug.nonProprietaryName}
                  </small>
                  <small className="text-black">{intolerance.reaction}</small>
                  <small className="text-black">{intolerance.severity}</small>
                </div>
              ))}
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      ) : (
        <span className="text-black italic">No Drug Intolerances</span>
      )}
      <button className="border divide-gray-200 flex hover:bg-transparent justify-between p-1 w-full">
        <span className="font-medium">Add Drug Intolerance</span>
        <HiPlus className="h-5 w-5" />
      </button>
    </>
  );
}
