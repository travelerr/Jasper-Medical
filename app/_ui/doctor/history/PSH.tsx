import { useContext, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { PastSurgicalHistory } from "@prisma/client";
import {
  CreatePastSurgicalHistoryInputs,
  DeletePastSurgicalHistoryInputs,
  EditPastSurgicalHistoryInputs,
} from "@/app/_lib/definitions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  createPastSurgicalHistory,
  editPastSurgicalHistory,
  deletePastSurgicalHistory,
} from "@/app/_lib/actions";

interface IPSH {
  pastSurgicalHistory: PastSurgicalHistory[];
  patientHistoryId: number;
}

export default function PSH(props: IPSH) {
  const { pastSurgicalHistory, patientHistoryId } = props;
  const [pshEditMode, setPshEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createPastSurgicalHistoryHandler = async (inputValue: string) => {
    const dto: CreatePastSurgicalHistoryInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createPastSurgicalHistory(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating past surgical history");
    }
  };

  const editPastSurgicalHistoryHandler = async (
    inputValue: string,
    id: number
  ) => {
    const dto: EditPastSurgicalHistoryInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editPastSurgicalHistory(dto);
      await refetchPatientData();
      setPshEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating past surgical history");
    }
  };

  const deletePastSurgicalHistoryHandler = async (id: number) => {
    const dto: DeletePastSurgicalHistoryInputs = {
      id: id,
    };
    try {
      await deletePastSurgicalHistory(dto);
      await refetchPatientData();
      setPshEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating past surgical history");
    }
  };

  const togglePshEditMode = (id: number) => {
    setPshEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="font-bold">{"PSH:"}</div>
      {pastSurgicalHistory
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((psh, index) => (
          <div
            key={psh.id}
            className={`flex items-center ${
              index !== pastSurgicalHistory.length - 1
                ? "border-b border-black"
                : ""
            }`}
          >
            <FaCaretRight onClick={() => togglePshEditMode(psh.id)} />
            {pshEditMode[psh.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={psh.note}
                  onBlurCallback={editPastSurgicalHistoryHandler}
                  editId={psh.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deletePastSurgicalHistoryHandler(psh.id)}
                />
              </div>
            ) : (
              <span>{psh.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add past surgical history"
        onBlurCallback={createPastSurgicalHistoryHandler}
      />
    </>
  );
}
