import { useContext, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { CognitiveStatus } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateCognitiveStatusInputs,
  DeleteCognitiveStatusInputs,
  EditCognitiveStatusInputs,
} from "@/app/_lib/definitions";
import {
  createCognitiveStatus,
  editCognitiveStatus,
  deleteCognitiveStatus,
} from "@/app/_lib/actions";

interface ICognitiveStatus {
  cognitiveStatus: CognitiveStatus[];
  patientHistoryId: number;
}

export default function CognitiveStatus(props: ICognitiveStatus) {
  const { cognitiveStatus, patientHistoryId } = props;
  const [csEditMode, setCsEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createCognitiveStatusHandler = async (inputValue: string) => {
    const dto: CreateCognitiveStatusInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createCognitiveStatus(dto);
      await refetchPatientData();
    } catch {
      console.error("Error creating cognitive status");
    }
  };

  const editCognitiveStatusHandler = async (inputValue: string, id: number) => {
    const dto: EditCognitiveStatusInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editCognitiveStatus(dto);
      await refetchPatientData();
      setCsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.error("Error creating cognitive status");
    }
  };

  const deleteCognitiveStatusHandler = async (id: number) => {
    const dto: DeleteCognitiveStatusInputs = {
      id: id,
    };
    try {
      await deleteCognitiveStatus(dto);
      await refetchPatientData();
      setCsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.error("Error creating cognitive status");
    }
  };

  const toggleCsEditMode = (id: number) => {
    setCsEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-green-100 border-b border-black p-1 rounded mb-3">
      <div className="font-bold">{"Cognitive Status:"}</div>
      {cognitiveStatus
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((cs, index) => (
          <div
            key={cs.id}
            className={`flex items-center ${
              index !== cognitiveStatus.length - 1
                ? "border-b border-black"
                : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleCsEditMode(cs.id)} />
            {csEditMode[cs.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={cs.note}
                  onBlurCallback={editCognitiveStatusHandler}
                  editId={cs.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteCognitiveStatusHandler(cs.id)}
                />
              </div>
            ) : (
              <span>{cs.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add cognitive status"
        onBlurCallback={createCognitiveStatusHandler}
      />
    </div>
  );
}
