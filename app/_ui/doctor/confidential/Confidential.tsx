import { FullPatientHistory } from "@/app/_lib/definitions";
import { ConfidentialNote } from "@prisma/client";
import {
  Accordion,
  AccordionPanel,
  AccordionTitle,
  AccordionContent,
} from "flowbite-react";
import ConfidentialNotes from "./ConfidentialNotes";

interface IConfidentialProps {
  confidentialNotes: ConfidentialNote[];
}

export default function Confidential(props: IConfidentialProps) {
  const { confidentialNotes } = props;

  return (
    <>
      <Accordion className="rounded-none" collapseAll>
        <AccordionPanel className="py-1 focus:outline-none rounded-none">
          <AccordionTitle className="text-black rounded-none bg-green-100 hover:bg-green-200">
            Provider Notes
          </AccordionTitle>
          <AccordionContent className="p-1 bg-white rounded-none caret-accordion">
            <ConfidentialNotes confidentialNotes={confidentialNotes} />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </>
  );
}
