import { useContext, useEffect, useState } from "react";
import OnBlurTextInput from "../../../_lib/inputs/blur/OnBlurTextInput";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import {
  PatientStressLevel,
  PsychologicalStatus,
  SurveyName,
} from "@prisma/client";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import {
  CreatePsychologicalStatusInputs,
  DeletePsychologicalStatusInputs,
  EditPsychologicalStatusInputs,
  EditPsychologicalStatusStressLevelInputs,
} from "@/app/_lib/definitions";
import {
  createPsychologicalStatus,
  editPsychologicalStatus,
  deletePsychologicalStatus,
  editPsychologicalStatusStressLevel,
} from "@/app/_lib/actions";
import { covertPascalCase } from "@/app/_lib/utils";
import { getSurveyScore } from "../../../_lib/inputs/surveys/SurveyFunctions";
import SurveyModal from "../surveys/HARKSurveyModal";
import GAD7SurveyModal from "../surveys/GAD7SurveyModal";
import PHQ2SurveyModal from "../surveys/PHQ2SurveyModal";
import PHQ4SurveyModal from "../surveys/PHQ4SurveyModal";
import PHQ9SurveyModal from "../surveys/PHQ9SurveyModal";

interface IPsychologicalStatus {
  psychologicalStatus: PsychologicalStatus[];
  patientHistoryId: number;
  psychologicalStatusStress: PatientStressLevel;
}

export default function PsychologicalStatus(props: IPsychologicalStatus) {
  const { psychologicalStatus, patientHistoryId, psychologicalStatusStress } =
    props;
  const [psEditMode, setPsEditMode] = useState<Record<number, boolean>>({});
  const [stressLevel, setStressLevel] = useState<PatientStressLevel>(null);
  const [openGAD7SurveyModal, setOpenGAD7SurveyModal] =
    useState<boolean>(false);
  const [openPHQ2SurveyModal, setOpenPHQ2SurveyModal] =
    useState<boolean>(false);
  const [openPHQ4SurveyModal, setOpenPHQ4SurveyModal] =
    useState<boolean>(false);
  const [openPHQ9SurveyModal, setOpenPHQ9SurveyModal] =
    useState<boolean>(false);
  const [stressLevelToggleMode, setStressLevelToggleMode] =
    useState<boolean>(false);
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  useEffect(() => {
    if (psychologicalStatusStress) {
      setStressLevel(psychologicalStatusStress);
    }
  }, [psychologicalStatusStress]);

  const createPsychologicalStatusHandler = async (inputValue: string) => {
    const dto: CreatePsychologicalStatusInputs = {
      note: inputValue,
      patientHistoryId: patientHistoryId,
    };
    try {
      await createPsychologicalStatus(dto);
      await refetchPatientData();
    } catch {
      console.error("Error creating psychological status");
    }
  };

  const editPsychologicalStatusHandler = async (
    inputValue: string,
    id: number
  ) => {
    const dto: EditPsychologicalStatusInputs = {
      note: inputValue,
      id: id,
    };
    try {
      await editPsychologicalStatus(dto);
      await refetchPatientData();
      setPsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.error("Error creating psychological status");
    }
  };

  const deletePsychologicalStatusHandler = async (id: number) => {
    const dto: DeletePsychologicalStatusInputs = {
      id: id,
    };
    try {
      await deletePsychologicalStatus(dto);
      await refetchPatientData();
      setPsEditMode((prevEditMode) => {
        const updatedEditMode = { ...prevEditMode };
        delete updatedEditMode[dto.id];
        return updatedEditMode;
      });
    } catch {
      console.error("Error creating psychological status");
    }
  };

  const togglePsEditMode = (id: number) => {
    setPsEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onChangeUpdateStressLevel = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let temp =
      PatientStressLevel[event.target.value as keyof typeof PatientStressLevel];
    setStressLevel(temp);
    try {
      const dto: EditPsychologicalStatusStressLevelInputs = {
        id: patientHistoryId,
        value: temp,
      };
      await editPsychologicalStatusStressLevel(dto);
      await refetchPatientData();
      setStressLevelToggleMode(false);
    } catch {
      console.error("Error setting social history financial strain");
    }
  };

  return (
    <>
      <div className="bg-green-100 border-b border-black p-1 rounded mb-3">
        <div className="font-bold">{"Psychological Status:"}</div>
        <div id="GAD7">
          <span className="link" onClick={() => setOpenGAD7SurveyModal(true)}>
            GAD-7:{" "}
            {getSurveyScore(
              SurveyName.GAD7,
              patient.patientHistory?.surveyScores
            )}
          </span>
          <div></div>
        </div>
        <div id="PHQ2">
          <span className="link" onClick={() => setOpenPHQ2SurveyModal(true)}>
            PHQ-2:{" "}
            {getSurveyScore(
              SurveyName.PHQ2,
              patient.patientHistory?.surveyScores
            )}
          </span>
          <div></div>
        </div>
        <div id="PHQ4">
          <span className="link" onClick={() => setOpenPHQ4SurveyModal(true)}>
            PHQ-4:{" "}
            {getSurveyScore(
              SurveyName.PHQ4,
              patient.patientHistory?.surveyScores
            )}
          </span>
          <div></div>
        </div>
        <div id="PHQ9">
          <span className="link" onClick={() => setOpenPHQ9SurveyModal(true)}>
            PHQ-9:{" "}
            {getSurveyScore(
              SurveyName.PHQ9,
              patient.patientHistory?.surveyScores
            )}
          </span>
          <div></div>
        </div>
        <div>
          Stress Level:
          <div className="flex items-center">
            <FaCaretRight
              onClick={() => setStressLevelToggleMode(!stressLevelToggleMode)}
            />
            {stressLevelToggleMode ? (
              <div className="flex m-1">
                <select
                  className="p-0 px-2.5 rounded text-sm w-full"
                  value={stressLevel}
                  onChange={onChangeUpdateStressLevel}
                >
                  {Object.values(PatientStressLevel).map((sl, index) => (
                    <option className="text-sm" key={index} value={sl}>
                      {covertPascalCase(sl)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span>
                {" "}
                {stressLevel?.length > 0
                  ? covertPascalCase(stressLevel)
                  : "Not set"}
              </span>
            )}
          </div>
        </div>
        {psychologicalStatus
          ?.sort(
            (a, b) =>
              new Date(a.createdDate).getTime() -
              new Date(b.createdDate).getTime()
          )
          .map((ps, index) => (
            <div
              key={ps.id}
              className={`flex items-center ${
                index !== psychologicalStatus.length - 1
                  ? "border-b border-black"
                  : ""
              }`}
            >
              <FaCaretRight onClick={() => togglePsEditMode(ps.id)} />
              {psEditMode[ps.id] ? (
                <div className="flex m-1">
                  <OnBlurTextInput
                    initialValue={ps.note}
                    onBlurCallback={editPsychologicalStatusHandler}
                    editId={ps.id}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer ml-1"
                    onClick={() => deletePsychologicalStatusHandler(ps.id)}
                  />
                </div>
              ) : (
                <span>{ps.note}</span>
              )}
            </div>
          ))}
        <OnBlurTextInput
          placeholder="Add psychological status"
          onBlurCallback={createPsychologicalStatusHandler}
        />
      </div>
      <GAD7SurveyModal
        openSurveyModal={openGAD7SurveyModal}
        setOpenSurveyModal={setOpenGAD7SurveyModal}
        patientHistoryId={patientHistoryId}
      />
      <PHQ2SurveyModal
        openSurveyModal={openPHQ2SurveyModal}
        setOpenSurveyModal={setOpenPHQ2SurveyModal}
        patientHistoryId={patientHistoryId}
      />
      <PHQ4SurveyModal
        openSurveyModal={openPHQ4SurveyModal}
        setOpenSurveyModal={setOpenPHQ4SurveyModal}
        patientHistoryId={patientHistoryId}
      />
      <PHQ9SurveyModal
        openSurveyModal={openPHQ9SurveyModal}
        setOpenSurveyModal={setOpenPHQ9SurveyModal}
        patientHistoryId={patientHistoryId}
      />
    </>
  );
}
