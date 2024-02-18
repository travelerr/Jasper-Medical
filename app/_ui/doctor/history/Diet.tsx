import { useContext, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { Diet } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateDietInputs,
  DeleteDietInputs,
  EditDietInputs,
} from "@/app/_lib/definitions";
import { createDiet, editDiet, deleteDiet } from "@/app/_lib/actions";

interface IDiet {
  diet: Diet[];
  patientHistoryId: number;
}

export default function Diet(props: IDiet) {
  const { diet, patientHistoryId } = props;
  const [dietEditMode, setDietEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createDietHandler = async (inputValue: string) => {
    const dto: CreateDietInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createDiet(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating diet");
    }
  };

  const editDietHandler = async (inputValue: string, id: number) => {
    const dto: EditDietInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editDiet(dto);
      await refetchPatientData();
      setDietEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating diet");
    }
  };

  const deleteDietHandler = async (id: number) => {
    const dto: DeleteDietInputs = {
      id: id,
    };
    try {
      await deleteDiet(dto);
      await refetchPatientData();
      setDietEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating diet");
    }
  };

  const toggleDietEditMode = (id: number) => {
    setDietEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-green-100 border-b border-black p-1 rounded mb-3">
      <div className="font-bold">{"Diet:"}</div>
      {diet
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((d, index) => (
          <div
            key={d.id}
            className={`flex items-center ${
              index !== diet.length - 1 ? "border-b border-black" : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleDietEditMode(d.id)} />
            {dietEditMode[d.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={d.note}
                  onBlurCallback={editDietHandler}
                  editId={d.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteDietHandler(d.id)}
                />
              </div>
            ) : (
              <span>{d.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add diet"
        onBlurCallback={createDietHandler}
      />
    </div>
  );
}
