import { ProblemList } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

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
            <AccordionContent className="p-1">
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
        <span className="text-black italic">No problem list</span>
      )}
    </>
  );
}
