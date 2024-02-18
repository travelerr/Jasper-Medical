import { useContext, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { FunctionalStatus } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateFunctionalStatusInputs,
  DeleteFunctionalStatusInputs,
  EditFunctionalStatusInputs,
} from "@/app/_lib/definitions";
import {
  createFunctionalStatus,
  editFunctionalStatus,
  deleteFunctionalStatus,
} from "@/app/_lib/actions";

interface IFunctionalStatus {
  functionalStatus: FunctionalStatus[];
  patientHistoryId: number;
}

export default function FunctionalStatus(props: IFunctionalStatus) {
  const { functionalStatus, patientHistoryId } = props;
  const [fsEditMode, setFsEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createFunctionalStatusHandler = async (inputValue: string) => {
    const dto: CreateFunctionalStatusInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createFunctionalStatus(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating functional status");
    }
  };

  const editFunctionalStatusHandler = async (
    inputValue: string,
    id: number
  ) => {
    const dto: EditFunctionalStatusInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editFunctionalStatus(dto);
      await refetchPatientData();
      setFsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating functional status");
    }
  };

  const deleteFunctionalStatusHandler = async (id: number) => {
    const dto: DeleteFunctionalStatusInputs = {
      id: id,
    };
    try {
      await deleteFunctionalStatus(dto);
      await refetchPatientData();
      setFsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating functional status");
    }
  };

  const toggleFsEditMode = (id: number) => {
    setFsEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-green-100 border-b border-black p-1 rounded mb-3">
      <div className="font-bold">{"Functional Status:"}</div>
      {functionalStatus
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((fs, index) => (
          <div
            key={fs.id}
            className={`flex items-center ${
              index !== functionalStatus.length - 1
                ? "border-b border-black"
                : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleFsEditMode(fs.id)} />
            {fsEditMode[fs.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={fs.note}
                  onBlurCallback={editFunctionalStatusHandler}
                  editId={fs.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteFunctionalStatusHandler(fs.id)}
                />
              </div>
            ) : (
              <span>{fs.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add functional status"
        onBlurCallback={createFunctionalStatusHandler}
      />
    </div>
  );
}
