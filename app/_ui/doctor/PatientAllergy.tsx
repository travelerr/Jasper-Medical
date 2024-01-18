import { Allergy } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import AddNewAllergyModal from "./AddNewAllergyModal";
import { useState } from "react";

interface IPatientAlleryProps {
  allergies: Allergy[];
}
export default function PatientAllery(props: IPatientAlleryProps) {
  const { allergies } = props;
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  return (
    <>
      {allergies.length ? (
        <Accordion className="rounded-none" collapseAll>
          <AccordionPanel className="py-1 focus:outline-none rounded-none">
            <AccordionTitle className="text-red-600 r">
              Allergies
            </AccordionTitle>
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
        <span className="text-black italic">No Allergies</span>
      )}
      <button
        className="border divide-gray-200 flex hover:bg-transparent justify-between p-1 w-full"
        onClick={() => setOpenCreateModal(true)}
      >
        <span className="font-medium">Add Allergy</span>
        <HiPlus className="h-5 w-5" />
      </button>
      <AddNewAllergyModal
        setOpenCreateModal={setOpenCreateModal}
        openCreateModal={openCreateModal}
        dismissible={true}
      ></AddNewAllergyModal>
    </>
  );
}
