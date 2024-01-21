import { ProblemList } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi";

interface IProblemListProps {
  problemList: ProblemList[];
}
export default function ProblemList(props: IProblemListProps) {
  const { problemList } = props;

  return (
    <>
      {problemList.length ? (
        <Accordion className="rounded-none" collapseAll>
          <AccordionPanel className="py-1 focus:outline-none">
            <AccordionTitle className="text-black">Problem List</AccordionTitle>
            <AccordionContent className="p-1 bg-white">
              {problemList.map((problem, index) => (
                <div
                  key={problem.id}
                  className={`flex flex-col ${
                    index !== problemList.length - 1
                      ? "border-b border-black"
                      : ""
                  }`}
                >
                  <small className="text-black">{problem.name}</small>
                  <small className="text-black">{problem.status}</small>
                  <small className="text-black">
                    {problem.dxDate.toDateString()}
                  </small>
                </div>
              ))}
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      ) : (
        <span className="text-black italic">No Problem List</span>
      )}
      <button className="border divide-gray-200 flex hover:bg-gray-100 justify-between p-1 w-full">
        <span className="font-medium">Add Problem</span>
        <HiPlus className="h-5 w-5" />
      </button>
    </>
  );
}
