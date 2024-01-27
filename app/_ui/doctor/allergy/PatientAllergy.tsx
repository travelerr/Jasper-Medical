import { Allergy } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import AddNewAllergyModal from "./NewAllergyModal";
import { useState } from "react";
import EditAllergyModal from "./EditAllergyModal";

interface IPatientAlleryProps {
  allergies: Allergy[];
}
export default function PatientAllery(props: IPatientAlleryProps) {
  const { allergies } = props;
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [allergyToEdit, setAllergyToEdit] = useState<Allergy | null>(null);

  const handleEditClick = (allergy: Allergy) => {
    setAllergyToEdit(allergy);
    setOpenEditModal(true);
  };
  return (
    <>
      {allergies?.length ? (
        <Accordion className="rounded-none" collapseAll>
          <AccordionPanel className="py-1 focus:outline-none rounded-none">
            <AccordionTitle className="text-red-600 rounded-none">
              Allergies
            </AccordionTitle>
            <AccordionContent className="p-1 bg-white rounded-none">
              <button
                className="border divide-gray-200 flex hover:bg-gray-100 justify-between p-1 w-full"
                onClick={() => setOpenCreateModal(true)}
              >
                <span className="font-medium">Add Allergy</span>
                <HiPlus className="h-5 w-5" />
              </button>
              {allergies.map((allergy, index) => (
                <div
                  key={allergy.id}
                  className={`flex flex-col ${
                    index !== allergies.length - 1
                      ? "border-b border-black"
                      : ""
                  }`}
                >
                  <p
                    className="link font-bold"
                    onClick={() => handleEditClick(allergy)}
                  >
                    {allergy.name}
                  </p>
                  <small className="text-black">
                    Reaction: {allergy.reaction}
                  </small>
                  <small className="text-black">
                    Severity: {allergy.severity}
                  </small>
                </div>
              ))}
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      ) : (
        <span className="text-black italic">No Allergies</span>
      )}
      <AddNewAllergyModal
        setOpenCreateModal={setOpenCreateModal}
        openCreateModal={openCreateModal}
      />
      <EditAllergyModal
        setOpenEditModal={setOpenEditModal}
        openEditModal={openEditModal}
        allergyToEdit={allergyToEdit}
      />
    </>
  );
}
