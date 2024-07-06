import { useContext, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import { ConfidentialNote } from "@prisma/client";
import {
  CreateConfidentialNoteInputs,
  DeleteConfidentialNoteInputs,
  EditConfidentialNoteInputs,
} from "@/app/_lib/definitions";
import {
  createConfidentialNote,
  createPastMedicalHistory,
  deleteConfidentialNoteByID,
  deletePastMedicalHistory,
  editPastMedicalHistory,
  updateConfidentialNote,
} from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";

interface IConfidentialNotes {
  confidentialNotes: ConfidentialNote[];
}

export default function ConfidentialNotes(props: IConfidentialNotes) {
  const { confidentialNotes } = props;
  const [noteEditMode, setNoteEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const createConfidentialNoteHandler = async (inputValue: string) => {
    const dto: CreateConfidentialNoteInputs = {
      note: inputValue,
      patientId: patient.id,
    };
    try {
      await createConfidentialNote(dto);
      await refetchPatientData();
    } catch {
      console.error("Error creating note.");
    }
  };

  const editConfidentialNoteHandler = async (
    inputValue: string,
    id: number
  ) => {
    const dto: EditConfidentialNoteInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await updateConfidentialNote(dto);
      await refetchPatientData();
      setNoteEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.error("Error editing note.");
    }
  };

  const deleteConfidentialNoteHandler = async (id: number) => {
    try {
      await deleteConfidentialNoteByID(id);
      await refetchPatientData();
      setNoteEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[id];
        return updatedEditMode;
      });
    } catch {
      console.error("Error deleting pnote.");
    }
  };

  const toggleCnEditMode = (id: number) => {
    setNoteEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-green-100 border-b border-black p-1 rounded my-3">
      <div className="font-bold">{"Notes:"}</div>
      {confidentialNotes
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((cn, index) => (
          <div
            key={cn.id}
            className={`flex items-center ${
              index !== confidentialNotes.length - 1
                ? "border-b border-black"
                : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleCnEditMode(cn.id)} />
            {noteEditMode[cn.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={cn.note}
                  onBlurCallback={editConfidentialNoteHandler}
                  editId={cn.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteConfidentialNoteHandler(cn.id)}
                />
              </div>
            ) : (
              <span>{cn.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add provider only note"
        onBlurCallback={createConfidentialNoteHandler}
      />
    </div>
  );
}
