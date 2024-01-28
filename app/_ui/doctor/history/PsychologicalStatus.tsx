import { useContext, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { PsychologicalStatus } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreatePsychologicalStatusInputs,
  DeletePsychologicalStatusInputs,
  EditPsychologicalStatusInputs,
} from "@/app/_lib/definitions";
import {
  createPsychologicalStatus,
  editPsychologicalStatus,
  deletePsychologicalStatus,
} from "@/app/_lib/actions";

interface IPsychologicalStatus {
  psychologicalStatus: PsychologicalStatus[];
  patientHistoryId: number;
}

export default function PsychologicalStatus(props: IPsychologicalStatus) {
  const { psychologicalStatus, patientHistoryId } = props;
  const [psEditMode, setPsEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createPsychologicalStatusHandler = async (inputValue: string) => {
    const dto: CreatePsychologicalStatusInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createPsychologicalStatus(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating psychological status");
    }
  };

  const editPsychologicalStatusHandler = async (
    inputValue: string,
    id: number
  ) => {
    const dto: EditPsychologicalStatusInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editPsychologicalStatus(dto);
      await refetchPatientData();
      setPsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating psychological status");
    }
  };

  const deletePsychologicalStatusHandler = async (id: number) => {
    const dto: DeletePsychologicalStatusInputs = {
      id: id,
    };
    try {
      await deletePsychologicalStatus(dto);
      await refetchPatientData();
      setPsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating psychological status");
    }
  };

  const togglePsEditMode = (id: number) => {
    setPsEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="font-bold">{"Psychological Status:"}</div>
      {psychologicalStatus
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((ps, index) => (
          <div
            key={ps.id}
            className={`flex items-center ${
              index !== psychologicalStatus.length - 1
                ? "border-b border-black"
                : ""
            }`}
          >
            <FaCaretRight onClick={() => togglePsEditMode(ps.id)} />
            {psEditMode[ps.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={ps.note}
                  onBlurCallback={editPsychologicalStatusHandler}
                  editId={ps.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deletePsychologicalStatusHandler(ps.id)}
                />
              </div>
            ) : (
              <span>{ps.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add psychological status"
        onBlurCallback={createPsychologicalStatusHandler}
      />
    </>
  );
}
