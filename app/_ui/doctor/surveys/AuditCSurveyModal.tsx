import { Button, Modal as FlowBiteModal } from "flowbite-react";
import LoadingOverlay from "../../loadingWidget";
import useViewState from "@/app/_lib/customHooks/useViewState";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { SurveyName, SurveyQuestionType, SurveyResponse } from "@prisma/client";
import { getSurveyByName } from "@/app/_lib/data";
import {
  SurveyDataWithRelations,
  SurveySubmission,
} from "@/app/_lib/definitions";
import { submitSurvey } from "@/app/_lib/actions";
import PatientDataContext from "@/app/_lib/contexts/PatientDataContext";
import SurveyRadioInput from "../../../_lib/inputs/surveys/SurveyRadioInput";

interface IAuditCSurveyModal {
  patientHistoryId?: number;
  openSurveyModal: boolean;
  setOpenSurveyModal: Function;
}

export default function AuditCSurveyModal(props: IAuditCSurveyModal) {
  const { openSurveyModal, setOpenSurveyModal, patientHistoryId } = props;
  const [surveyData, setSurveyData] = useState<SurveyDataWithRelations>(null);
  const [surveyResponses, setSurveyResponses] =
    useState<SurveyResponse[]>(null);
  const { viewState, setLoading } = useViewState();
  const { refetchPatientData, patient } = useContext(PatientDataContext);

  const radioOptions0 = [
    { value: "0", label: "Never" },
    { value: "1", label: "Monthly or less" },
    { value: "2", label: "Two to four times a month" },
    { value: "3", label: "Two to three times a week" },
    { value: "4", label: "Four or more times a week" },
  ];

  const radioOptions1 = [
    { value: "0", label: "1 or 2 or less" },
    { value: "1", label: "3 or 4" },
    { value: "2", label: "5 or 6" },
    { value: "3", label: "7 to 9" },
    { value: "4", label: "10 or more" },
  ];

  const radioOptions2 = [
    { value: "0", label: "Never" },
    { value: "1", label: "Less than monthly" },
    { value: "2", label: "Monthly" },
    { value: "3", label: "Weekly" },
    { value: "4", label: "Daily or almost daily	" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    const dto: SurveySubmission = {
      responsesArr: [],
      score: 0,
      surveyId: surveyData.id,
      patientHistoryId: patientHistoryId,
      surveyName: SurveyName[surveyData.surveyName],
    };
    surveyData.questions.forEach((q) => {
      if (!data[q.id]) {
        return;
      }
      let response: any = {
        surveyId: surveyData.id,
        patientHistoryId: patientHistoryId,
        questionId: q.id,
        type: q.type,
      };
      if (q.type === SurveyQuestionType.Number) {
        response.responseInt = Number(data[q.id]);
        dto.score += Number(data[q.id]);
      }
      dto.responsesArr.push(response);
    });
    try {
      setLoading(true);
      await submitSurvey(dto);
      await refetchPatientData();
      setLoading(false);
      reset();
      setOpenSurveyModal(false);
    } catch (error) {
      setLoading(false);
    }
  };

  async function getSurveyData() {
    try {
      setLoading(true);
      if (patientHistoryId) {
        const result = await getSurveyByName(
          SurveyName.AUDITC,
          patientHistoryId
        );
        setSurveyData(result);
        setSurveyResponses(result.responses);
      } else {
        const result = await getSurveyByName(SurveyName.AUDITC);
        setSurveyData(result);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "There was an error fetching the survey");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (openSurveyModal) {
      getSurveyData();
    }
  }, [patientHistoryId, openSurveyModal]);

  useEffect(() => {
    if (surveyResponses && surveyData.questions) {
      surveyResponses.forEach((answer) => {
        // Find the corresponding question
        const question = surveyData.questions.find(
          (q) => q.id === answer.questionId
        );
        if (!question) return; // Skip if no matching question is found
        // Determine the answer type and value
        let answerValue;
        switch (answer.type) {
          case "Number":
            answerValue = answer.responseInt;
            break;
          default:
            return; // Skip if the type is unrecognized
        }
        // Set the value using setValue, assuming field names are `question_${questionId}`
        const fieldName = answer.questionId.toString();
        setValue(fieldName, answerValue.toString());
      });
    }
  }, [surveyResponses]);

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openSurveyModal}
      className="relative"
      onClose={() => setOpenSurveyModal(false)}
    >
      <FlowBiteModal.Header>
        <div>
          <div>{SurveyName.AUDITC}</div>
        </div>
      </FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-scroll">
        <FlowBiteModal.Body>
          <LoadingOverlay isLoading={viewState.loading} />
          <p className="text-center text-2xl">
            Over the last 2 weeks, how often have you been bothered by any of
            the following problems?{" "}
          </p>
          {surveyData && surveyData.questions ? (
            <div className="flex flex-col items-center justify-center">
              {surveyData.questions
                ?.sort((a, b) => a.sortOrder - b.sortOrder)
                .map((q, index) => (
                  <div className="w-1/2 flex my-5" key={q.id}>
                    <div className="text-2xl mr-3">{index + 1}</div>
                    {q.type == SurveyQuestionType.Number ? (
                      <SurveyRadioInput
                        questionText={q.text}
                        questionId={q.id}
                        register={register}
                        radioOptions={
                          index === 0
                            ? radioOptions0
                            : index === 1
                            ? radioOptions1
                            : index === 2
                            ? radioOptions2
                            : null
                        }
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          ) : null}
        </FlowBiteModal.Body>
        <FlowBiteModal.Footer>
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenSurveyModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
