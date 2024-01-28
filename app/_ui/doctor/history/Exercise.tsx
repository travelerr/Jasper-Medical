import { useContext, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { Exercise } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateExerciseInputs,
  DeleteExerciseInputs,
  EditExerciseInputs,
} from "@/app/_lib/definitions";
import {
  createExercise,
  editExercise,
  deleteExercise,
} from "@/app/_lib/actions";

interface IExercise {
  exercise: Exercise[];
  patientHistoryId: number;
}

export default function Exercise(props: IExercise) {
  const { exercise, patientHistoryId } = props;
  const [exerciseEditMode, setExerciseEditMode] = useState<
    Record<number, boolean>
  >({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createExerciseHandler = async (inputValue: string) => {
    const dto: CreateExerciseInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createExercise(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating exercise");
    }
  };

  const editExerciseHandler = async (inputValue: string, id: number) => {
    const dto: EditExerciseInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editExercise(dto);
      await refetchPatientData();
      setExerciseEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating exercise");
    }
  };

  const deleteExerciseHandler = async (id: number) => {
    const dto: DeleteExerciseInputs = {
      id: id,
    };
    try {
      await deleteExercise(dto);
      await refetchPatientData();
      setExerciseEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating exercise");
    }
  };

  const toggleExerciseEditMode = (id: number) => {
    setExerciseEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="font-bold">{"Exercise:"}</div>
      {exercise
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((d, index) => (
          <div
            key={d.id}
            className={`flex items-center ${
              index !== exercise.length - 1 ? "border-b border-black" : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleExerciseEditMode(d.id)} />
            {exerciseEditMode[d.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={d.note}
                  onBlurCallback={editExerciseHandler}
                  editId={d.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteExerciseHandler(d.id)}
                />
              </div>
            ) : (
              <span>{d.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add exercise"
        onBlurCallback={createExerciseHandler}
      />
    </>
  );
}
