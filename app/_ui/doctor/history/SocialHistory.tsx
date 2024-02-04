import { useContext, useEffect, useState } from "react";
import OnBlurTextInput from "./OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import {
  PatientEducationLevel,
  PatientFinancialStrain,
  SocialHistory,
} from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreateSocialHistoryInputs,
  DeleteSocialHistoryInputs,
  EditSocialHistoryEducationLevelInputs,
  EditSocialHistoryFinancialStrainInputs,
  EditSocialHistoryInputs,
} from "@/app/_lib/definitions";
import {
  createSocialHistory,
  editSocialHistory,
  deleteSocialHistory,
  editSocialHistoryFinancialStrain,
  editSocialHistoryEducationLevel,
} from "@/app/_lib/actions";
import { covertPascalCase } from "@/app/_lib/utils";

interface ISocialHistory {
  socialHistory: SocialHistory[];
  patientHistoryId: number;
  socialHistoryEducation: PatientEducationLevel;
  socialHistoryFinancialStrain: PatientFinancialStrain;
}

export default function SocialHistory(props: ISocialHistory) {
  const {
    socialHistory,
    patientHistoryId,
    socialHistoryEducation,
    socialHistoryFinancialStrain,
  } = props;
  const [socialHistoryEditMode, setSocialHistoryEditMode] = useState<
    Record<number, boolean>
  >({});
  const [educationLevel, setEducationLevel] =
    useState<PatientEducationLevel>(null);
  const [educationLevelToggleMode, setEducationLevelToggleMode] =
    useState<boolean>(false);
  const [financialStrain, setFinancialStrain] =
    useState<PatientFinancialStrain>(null);
  const [financialStrainToggleMode, setFinancialStrainToggleMode] =
    useState<boolean>(false);

  const { refetchPatientData } = useContext(PatientDataContext);

  useEffect(() => {
    if (socialHistoryEducation) {
      setEducationLevel(socialHistoryEducation);
    }
    if (socialHistoryFinancialStrain) {
      setFinancialStrain(socialHistoryFinancialStrain);
    }
  }, [socialHistoryEducation, socialHistoryFinancialStrain]);

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

  const onChangeUpdateEducationLevel = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let temp =
      PatientEducationLevel[
        event.target.value as keyof typeof PatientEducationLevel
      ];
    setEducationLevel(temp);
    try {
      const dto: EditSocialHistoryEducationLevelInputs = {
        id: patientHistoryId,
        value: temp,
      };
      await editSocialHistoryEducationLevel(dto);
      await refetchPatientData();
      setEducationLevelToggleMode(false);
    } catch {
      console.log("Error setting social history education level");
    }
  };

  const onChangeUpdateFinancialStrain = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let temp =
      PatientFinancialStrain[
        event.target.value as keyof typeof PatientFinancialStrain
      ];
    setFinancialStrain(temp);
    try {
      const dto: EditSocialHistoryFinancialStrainInputs = {
        id: patientHistoryId,
        value: temp,
      };
      await editSocialHistoryFinancialStrain(dto);
      await refetchPatientData();
      setFinancialStrainToggleMode(false);
    } catch {
      console.log("Error setting social history financial strain");
    }
  };

  return (
    <div className="bg-green-100 p-1 rounded mb-3">
      <div className="font-bold">{"Social History:"}</div>
      <div>
        Financial Strain:
        <div className="flex items-center">
          <FaCaretRight
            onClick={() =>
              setFinancialStrainToggleMode(!financialStrainToggleMode)
            }
          />
          {financialStrainToggleMode ? (
            <div className="flex m-1">
              <select
                className="p-0 px-2.5 rounded text-sm w-full"
                value={financialStrain}
                onChange={onChangeUpdateFinancialStrain}
              >
                {Object.values(PatientFinancialStrain).map((el, index) => (
                  <option className="text-sm" key={index} value={el}>
                    {covertPascalCase(el)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span>
              {" "}
              {financialStrain?.length > 0
                ? covertPascalCase(financialStrain)
                : "Not set"}
            </span>
          )}
        </div>
      </div>
      <div>
        Education Level:
        <div className="flex items-center">
          <FaCaretRight
            onClick={() =>
              setEducationLevelToggleMode(!educationLevelToggleMode)
            }
          />
          {educationLevelToggleMode ? (
            <div className="flex m-1">
              <select
                className="p-0 px-2.5 rounded text-sm w-full"
                value={educationLevel}
                onChange={onChangeUpdateEducationLevel}
              >
                {Object.values(PatientEducationLevel).map((el, index) => (
                  <option className="text-sm" key={index} value={el}>
                    {covertPascalCase(el)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span>
              {educationLevel?.length > 0
                ? covertPascalCase(educationLevel)
                : "Not set"}
            </span>
          )}
        </div>
      </div>
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
    </div>
  );
}
