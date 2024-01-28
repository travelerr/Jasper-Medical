import { useContext, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import { FamilyHistory } from "@prisma/client";
import {
  CreateFamilyHistoryInputs,
  DeleteFamilyHistoryInputs,
  EditFamilyHistoryInputs,
} from "@/app/_lib/definitions";
import {
  createFamilyHistory,
  deleteFamilyHistory,
  editFamilyHistory,
  updateFamilyRelative,
} from "@/app/_lib/actions";

interface IFH {
  familyHistory: FamilyHistory[];
  patientHistoryId: number;
  mother?: string;
  father?: string;
  brother?: string;
  sister?: string;
  son?: string;
  daughter?: string;
  grandmother?: string;
  grandfather?: string;
  aunt?: string;
  uncle?: string;
  other?: string;
}

export default function FH(props: IFH) {
  const {
    familyHistory,
    patientHistoryId,
    mother,
    father,
    brother,
    sister,
    son,
    daughter,
    grandfather,
    grandmother,
    aunt,
    uncle,
    other,
  } = props;
  const [fhEditMode, setFhEditMode] = useState<Record<number, boolean>>({});
  const { refetchPatientData } = useContext(PatientDataContext);

  const createFamilyHistoryHandler = async (inputValue: string) => {
    const dto: CreateFamilyHistoryInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createFamilyHistory(dto);
      await refetchPatientData();
    } catch {
      console.log("Error creating family history");
    }
  };

  const editFamilyHistoryHandler = async (inputValue: string, id: number) => {
    const dto: EditFamilyHistoryInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editFamilyHistory(dto);
      await refetchPatientData();
      setFhEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id]; // Remove the key-value pair for the edited PMH item
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating family history");
    }
  };

  const deleteFamilyHistoryHandler = async (id: number) => {
    const dto: DeleteFamilyHistoryInputs = {
      id: id,
    };
    try {
      await deleteFamilyHistory(dto);
      await refetchPatientData();
      setFhEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.log("Error creating family history");
    }
  };

  const updateFamilyHistoryRelative = async (
    inputValue: string,
    id: number,
    relative: string
  ) => {
    const validRelatives = [
      "mother",
      "father",
      "brother",
      "sister",
      "son",
      "daughter",
      "grandmother",
      "grandfather",
      "aunt",
      "uncle",
      "other",
    ];

    try {
      if (validRelatives.includes(relative)) {
        await updateFamilyRelative({
          id: patientHistoryId,
          relative: relative,
          value: inputValue,
        });
        await refetchPatientData();
      } else {
        console.log("Invalid relative type");
      }
    } catch (error) {
      console.log("Error updating family history relative:", error);
    }
  };

  const toggleFhEditMode = (id: number) => {
    setFhEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // How to hanle updating mother, father, etc
  // How to only refecth parts of patient profile

  return (
    <>
      <div className="font-bold">{"FH:"}</div>
      <div className="flex items-center">
        <span>Mother:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"mother"}
          initialValue={mother}
        />
      </div>
      <div className="flex items-center">
        <span>Father:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"father"}
          initialValue={father}
        />
      </div>
      <div className="flex items-center">
        <span>Brother:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"brother"}
          initialValue={brother}
        />
      </div>
      <div className="flex items-center">
        <span>Sister:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"sister"}
          initialValue={sister}
        />
      </div>
      <div className="flex items-center">
        <span>Son:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"son"}
          initialValue={son}
        />
      </div>
      <div className="flex items-center">
        <span>Daughter:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"daughter"}
          initialValue={daughter}
        />
      </div>
      <div className="flex items-center">
        <span>GMother:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"grandmother"}
          initialValue={grandmother}
        />
      </div>
      <div className="flex items-center">
        <span>GFather:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"grandfather"}
          initialValue={grandfather}
        />
      </div>
      <div className="flex items-center">
        <span>Aunt:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"aunt"}
          initialValue={aunt}
        />
      </div>
      <div className="flex items-center">
        <span>Uncle:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"uncle"}
          initialValue={uncle}
        />
      </div>
      <div className="flex items-center">
        <span>Other:</span>
        <OnBlurTextInput
          className="ml-1"
          onBlurCallback={updateFamilyHistoryRelative}
          editString={"other"}
          initialValue={other}
        />
      </div>
      {familyHistory
        ?.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        )
        .map((fh, index) => (
          <div
            key={fh.id}
            className={`flex items-center ${
              index !== familyHistory.length - 1 ? "border-b border-black" : ""
            }`}
          >
            <FaCaretRight onClick={() => toggleFhEditMode(fh.id)} />
            {fhEditMode[fh.id] ? (
              <div className="flex m-1">
                <OnBlurTextInput
                  initialValue={fh.note}
                  onBlurCallback={editFamilyHistoryHandler}
                  editId={fh.id}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer ml-1"
                  onClick={() => deleteFamilyHistoryHandler(fh.id)}
                />
              </div>
            ) : (
              <span>{fh.note}</span>
            )}
          </div>
        ))}
      <OnBlurTextInput
        placeholder="Add family history"
        onBlurCallback={createFamilyHistoryHandler}
      />
    </>
  );
}
