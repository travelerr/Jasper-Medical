import { useContext, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
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
  const [relativeEditMode, setRelativeEditMode] = useState<
    Record<string, boolean>
  >({});
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
      console.error("Error creating family history");
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
      console.error("Error creating family history");
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
      console.error("Error creating family history");
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
        setRelativeEditMode((prevEditMode) => {
          const updatedEditMode = { ...prevEditMode };
          delete updatedEditMode[relative];
          return updatedEditMode;
        });
      } else {
        console.error("Invalid relative type");
      }
    } catch (error) {
      console.error("Error updating family history relative:", error);
    }
  };

  const toggleFhEditMode = (id: number) => {
    setFhEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRelativeEditMode = (relative: string) => {
    setRelativeEditMode((prev) => ({ ...prev, [relative]: !prev[relative] }));
  };

  return (
    <div className="bg-green-100 border-b border-black p-1 rounded mb-3">
      <div className="font-bold">{"FH:"}</div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("mother")} />
        <span className="mr-1">Mother:</span>
        {relativeEditMode["mother"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"mother"}
              initialValue={mother}
            />
          </div>
        ) : (
          <span>{mother}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("father")} />
        <span className="mr-1">Father:</span>
        {relativeEditMode["father"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"father"}
              initialValue={father}
            />
          </div>
        ) : (
          <span>{father}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("brother")} />
        <span className="mr-1">Brother:</span>
        {relativeEditMode["brother"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"brother"}
              initialValue={brother}
            />
          </div>
        ) : (
          <span>{brother}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("sister")} />
        <span className="mr-1">Sister:</span>
        {relativeEditMode["sister"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"sister"}
              initialValue={sister}
            />
          </div>
        ) : (
          <span>{sister}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("son")} />
        <span className="mr-1">Son:</span>
        {relativeEditMode["son"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"son"}
              initialValue={son}
            />
          </div>
        ) : (
          <span>{son}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("daughter")} />
        <span className="mr-1">Daughter:</span>
        {relativeEditMode["daughter"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"daughter"}
              initialValue={daughter}
            />
          </div>
        ) : (
          <span>{daughter}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("grandmother")} />
        <span className="mr-1">GMother:</span>
        {relativeEditMode["grandmother"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"grandmother"}
              initialValue={grandmother}
            />
          </div>
        ) : (
          <span>{grandmother}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("grandfather")} />
        <span className="mr-1">GFather:</span>
        {relativeEditMode["grandfather"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"grandfather"}
              initialValue={grandfather}
            />
          </div>
        ) : (
          <span>{grandfather}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("aunt")} />
        <span className="mr-1">Aunt:</span>
        {relativeEditMode["aunt"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"aunt"}
              initialValue={aunt}
            />
          </div>
        ) : (
          <span>{aunt}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("uncle")} />
        <span className="mr-1">Uncle:</span>
        {relativeEditMode["uncle"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"uncle"}
              initialValue={uncle}
            />
          </div>
        ) : (
          <span>{uncle}</span>
        )}
      </div>
      <div className="flex items-center">
        <FaCaretRight onClick={() => toggleRelativeEditMode("other")} />
        <span className="mr-1">Other:</span>
        {relativeEditMode["other"] ? (
          <div className="flex m-1">
            <OnBlurTextInput
              className="ml-1"
              onBlurCallback={updateFamilyHistoryRelative}
              editString={"other"}
              initialValue={other}
            />
          </div>
        ) : (
          <span>{other}</span>
        )}
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
    </div>
  );
}
