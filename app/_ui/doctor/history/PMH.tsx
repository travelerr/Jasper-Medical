import { useContext, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { PastMedicalHistory } from "@prisma/client";
import {
  CreatePastMedicalHistoryInputs,
  DeletePastMedicalHistoryInputs,
  EditPastMedicalHistoryInputs,
} from "@/app/_lib/definitions";
import {
  createPastMedicalHistory,
  deletePastMedicalHistory,
  editPastMedicalHistory,
} from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";

interface IPMH {
  pastMedicalHistory: PastMedicalHistory[];
  patientHistoryId: number;
}

export default function PMH(props: IPMH) {
  const { pastMedicalHistory, patientHistoryId } = props;
  const [pmhEditMode, setPmhEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createPastMedicalHistoryHandler = async (inputValue: string) => {
    const dto: CreatePastMedicalHistoryInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createPastMedicalHistory(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating past medical history");
    }
  };

  const editPastMedicalHistoryHandler = async (
    inputValue: string,
    id: number
  ) => {
    const dto: EditPastMedicalHistoryInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editPastMedicalHistory(dto);
      await refetchPatientData();
      setPmhEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id]; // Remove the key-value pair for the edited PMH item
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating past medical history");
    }
  };

  const deletePastMedicalHistoryHandler = async (id: number) => {
    const dto: DeletePastMedicalHistoryInputs = {
      id: id,
    };
    try {
      await deletePastMedicalHistory(dto);
      await refetchPatientData();
      setPmhEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating past medical history");
    }
  };

  const togglePmhEditMode = (id: number) => {
    setPmhEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-green-100 border-b border-black p-1 rounded my-3">
      <div className="font-bold">{"PMH:"}</div>
      {pastMedicalHistory
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((pmh, index) => (
          <div
            key={pmh.id}
            className={`flex items-center ${
              index !== pastMedicalHistory.length - 1
                ? "border-b border-black"
                : ""
            }`}
          >
            <FaCaretRight onClick={() => togglePmhEditMode(pmh.id)} />
            {pmhEditMode[pmh.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={pmh.note}
                  onBlurCallback={editPastMedicalHistoryHandler}
                  editId={pmh.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deletePastMedicalHistoryHandler(pmh.id)}
                />
              </div>
            ) : (
              <span>{pmh.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add past medical history"
        onBlurCallback={createPastMedicalHistoryHandler}
      />
    </div>
  );
}
