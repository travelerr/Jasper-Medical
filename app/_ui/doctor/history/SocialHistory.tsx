import { useContext, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { SocialHistory } from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateSocialHistoryInputs,
  DeleteSocialHistoryInputs,
  EditSocialHistoryInputs,
} from "@/app/_lib/definitions";
import {
  createSocialHistory,
  editSocialHistory,
  deleteSocialHistory,
} from "@/app/_lib/actions";

interface ISocialHistory {
  socialHistory: SocialHistory[];
  patientHistoryId: number;
}

export default function SocialHistory(props: ISocialHistory) {
  const { socialHistory, patientHistoryId } = props;
  const [socialHistoryEditMode, setSocialHistoryEditMode] = useState<
    Record<number, boolean>
  >({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createSocialHistoryHandler = async (inputValue: string) => {
    const dto: CreateSocialHistoryInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createSocialHistory(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating social history");
    }
  };

  const editSocialHistoryHandler = async (inputValue: string, id: number) => {
    const dto: EditSocialHistoryInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editSocialHistory(dto);
      await refetchPatientData();
      setSocialHistoryEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating social history");
    }
  };

  const deleteSocialHistoryHandler = async (id: number) => {
    const dto: DeleteSocialHistoryInputs = {
      id: id,
    };
    try {
      await deleteSocialHistory(dto);
      await refetchPatientData();
      setSocialHistoryEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating social history");
    }
  };

  const toggleSocialHistoryEditMode = (id: number) => {
    setSocialHistoryEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="font-bold">{"Social History:"}</div>
      {socialHistory
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((sh, index) => (
          <div
            key={sh.id}
            className={`flex items-center ${
              index !== socialHistory.length - 1 ? "border-b border-black" : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleSocialHistoryEditMode(sh.id)} />
            {socialHistoryEditMode[sh.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={sh.note}
                  onBlurCallback={editSocialHistoryHandler}
                  editId={sh.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteSocialHistoryHandler(sh.id)}
                />
              </div>
            ) : (
              <span>{sh.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add social history"
        onBlurCallback={createSocialHistoryHandler}
      />
    </>
  );
}
