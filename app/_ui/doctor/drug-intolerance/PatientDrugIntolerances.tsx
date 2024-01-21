import { Drug, DrugIntolerance } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import AddNewDrugIntoleranceModal from "./NewDrugIntoleranceModal";
import { useState } from "react";
import EditDrugIntoleranceModal from "./EditDrugIntoleranceModal";

interface IPatientDrugIntolerancesProps {
  intolerances: (DrugIntolerance & { drug: Drug })[];
}
export default function PatientDrugIntolerances(
  props: IPatientDrugIntolerancesProps
) {
  const { intolerances } = props;
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [drugIntoleranceToEdit, setDrugIntoleranceToEdit] = useState<
    (DrugIntolerance & { drug: Drug }) | null
  >(null);

  const handleEditClick = (intolerance: DrugIntolerance & { drug: Drug }) => {
    setDrugIntoleranceToEdit(intolerance);
    setOpenEditModal(true);
  };

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
                  <p
                    className="text-blue-500 font-medium cursor-pointer"
                    onClick={() => handleEditClick(intolerance)}
                  >
                    {intolerance.drug.proprietaryName ??
                      intolerance.drug.nonProprietaryName}
                  </p>
                  <small className="text-black">
                    Reaction: {intolerance.reaction}
                  </small>
                  <small className="text-black">
                    Severity: {intolerance.severity}
                  </small>
                </div>
              ))}
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      ) : (
        <span className="text-black italic">No Drug Intolerances</span>
      )}
      <button
        className="border divide-gray-200 flex hover:bg-gray-100 justify-between p-1 w-full"
        onClick={() => setOpenCreateModal(true)}
      >
        <span className="font-medium">Add Drug Intolerance</span>
        <HiPlus className="h-5 w-5" />
      </button>
      <AddNewDrugIntoleranceModal
        setOpenCreateModal={setOpenCreateModal}
        openCreateModal={openCreateModal}
      />
      <EditDrugIntoleranceModal
        setOpenEditModal={setOpenEditModal}
        openEditModal={openEditModal}
        drugIntoleranceToEdit={drugIntoleranceToEdit}
      />
    </>
  );
}
