import { ICD10Code, ProblemList, ProblemListICD10Code } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import EditProblemModal from "./EditProblemModal";
import NewProblemModal from "./NewProblemModal";

interface IProblemListProps {
  problemList: (ProblemList & {
    icd10Codes: (ProblemListICD10Code & { icd10Code: ICD10Code })[];
  })[];
}
export default function PatientProblemList(props: IProblemListProps) {
  const { problemList } = props;
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [problemToEdit, setProblemToEdit] = useState<
    | (ProblemList & {
        icd10Codes: (ProblemListICD10Code & { icd10Code: ICD10Code })[];
      })
    | null
  >(null);

  const handleEditClick = (
    problem: ProblemList & {
      icd10Codes: (ProblemListICD10Code & { icd10Code: ICD10Code })[];
    }
  ) => {
    setProblemToEdit(problem);
    setOpenEditModal(true);
  };

  return (
    <>
      <Accordion className="rounded-none" collapseAll>
        <AccordionPanel className="py-1 focus:outline-none">
          <AccordionTitle className="text-black bg-yellow-100 hover:bg-yellow-200">
            {problemList?.length ? " Problem List" : "No Problem List"}
          </AccordionTitle>
          <AccordionContent className="p-1 bg-white">
            <button
              className="border divide-gray-200 flex justify-between p-1 w-full bg-amber-400 hover:bg-amber-500"
              onClick={() => setOpenCreateModal(true)}
            >
              <span className="font-medium">Add Problem</span>
              <HiPlus className="h-5 w-5" />
            </button>
            {problemList.map((problem, index) => (
              <div
                key={problem.id}
                className={`flex flex-col ${
                  index !== problemList.length - 1
                    ? "border-b border-black bg-yellow-100 p-1 rounded my-1"
                    : "bg-yellow-100 p-1 rounded my-1"
                }`}
              >
                <p
                  className="link font-bold"
                  onClick={() => handleEditClick(problem)}
                >
                  {problem.name}
                </p>
                <small className="text-black">Status: {problem.status}</small>
                <small className="text-black">
                  Dx Date: {problem.dxDate.toDateString()}
                </small>
              </div>
            ))}
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <NewProblemModal
        setOpenCreateModal={setOpenCreateModal}
        openCreateModal={openCreateModal}
      />
      <EditProblemModal
        setOpenEditModal={setOpenEditModal}
        openEditModal={openEditModal}
        problemToEdit={problemToEdit}
      />
    </>
  );
}
