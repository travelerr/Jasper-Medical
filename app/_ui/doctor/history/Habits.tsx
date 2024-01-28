import { useContext, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { Habits } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateHabitInputs,
  DeleteHabitInputs,
  EditHabitInputs,
} from "@/app/_lib/definitions";
import { createHabit, editHabit, deleteHabit } from "@/app/_lib/actions";

interface IHabits {
  habits: Habits[];
  patientHistoryId: number;
}

export default function Habits(props: IHabits) {
  const { habits, patientHistoryId } = props;
  const [habitsEditMode, setHabitEditMode] = useState<Record<number, boolean>>(
    {}
  );
  const { refetchPatientData } = useContext(PatientDataContext);

  const createHabitHandler = async (inputValue: string) => {
    const dto: CreateHabitInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createHabit(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating habit");
    }
  };

  const editHabitHandler = async (inputValue: string, id: number) => {
    const dto: EditHabitInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editHabit(dto);
      await refetchPatientData();
      setHabitEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating habit");
    }
  };

  const deleteHabitHandler = async (id: number) => {
    const dto: DeleteHabitInputs = {
      id: id,
    };
    try {
      await deleteHabit(dto);
      await refetchPatientData();
      setHabitEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating habit");
    }
  };

  const toggleHabitEditMode = (id: number) => {
    setHabitEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="font-bold">{"Habits:"}</div>
      {habits
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((h, index) => (
          <div
            key={h.id}
            className={`flex items-center ${
              index !== habits.length - 1 ? "border-b border-black" : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleHabitEditMode(h.id)} />
            {habitsEditMode[h.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={h.note}
                  onBlurCallback={editHabitHandler}
                  editId={h.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteHabitHandler(h.id)}
                />
              </div>
            ) : (
              <span>{h.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add habit"
        onBlurCallback={createHabitHandler}
      />
    </>
  );
}
