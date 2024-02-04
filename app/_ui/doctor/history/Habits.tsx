import { useContext, useEffect, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { Habits, PatientSmokingStatus } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateHabitInputs,
  DeleteHabitInputs,
  EditHabitInputs,
  EditHabitSmokingStatusInputs,
} from "@/app/_lib/definitions";
import {
  createHabit,
  editHabit,
  deleteHabit,
  editHabitSmokingStatus,
} from "@/app/_lib/actions";
import { covertPascalCase } from "@/app/_lib/utils";

interface IHabits {
  habits: Habits[];
  patientHistoryId: number;
  habitsSmokingStatus: PatientSmokingStatus;
}

export default function Habits(props: IHabits) {
  const { habits, patientHistoryId, habitsSmokingStatus } = props;
  const [habitsEditMode, setHabitEditMode] = useState<Record<number, boolean>>(
    {}
  );
  const [smokingStatus, setSmokingStatus] =
    useState<PatientSmokingStatus>(null);
  const [smokingStatusToggleMode, setSmokingStatusToggleMode] =
    useState<boolean>(false);
  const { refetchPatientData } = useContext(PatientDataContext);

  useEffect(() => {
    if (habitsSmokingStatus) {
      setSmokingStatus(habitsSmokingStatus);
    }
  }, [habitsSmokingStatus]);

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

  const onChangeUpdateSmokingStatus = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let temp =
      PatientSmokingStatus[
        event.target.value as keyof typeof PatientSmokingStatus
      ];
    setSmokingStatus(temp);
    try {
      const dto: EditHabitSmokingStatusInputs = {
        id: patientHistoryId,
        value: temp,
      };
      await editHabitSmokingStatus(dto);
      await refetchPatientData();
      setSmokingStatusToggleMode(false);
    } catch {
      console.log("Error setting social history financial strain");
    }
  };

  return (
    <div className="bg-green-100 p-1 rounded mb-3">
      <div>
        Smoking Status:
        <div className="flex items-center">
          <FaCaretRight
            onClick={() => setSmokingStatusToggleMode(!smokingStatusToggleMode)}
          />
          {smokingStatusToggleMode ? (
            <div className="flex m-1">
              <select
                className="p-0 px-2.5 rounded text-sm w-full"
                value={smokingStatus}
                onChange={onChangeUpdateSmokingStatus}
              >
                {Object.values(PatientSmokingStatus).map((ss, index) => (
                  <option className="text-sm" key={index} value={ss}>
                    {covertPascalCase(ss)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span>
              {" "}
              {smokingStatus?.length > 0
                ? covertPascalCase(smokingStatus)
                : "Not set"}
            </span>
          )}
        </div>
      </div>
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
    </div>
  );
}
