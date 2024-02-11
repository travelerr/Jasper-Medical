import { SurveyName, SurveyScore } from "@prisma/client";

export const getSurveyScore = (
  surveyName: SurveyName,
  surveyScores: SurveyScore[]
): string => {
  if (!surveyScores) return;
  const score = surveyScores.find((x) => x.surveyName === surveyName);
  return score ? score.score.toString() : "NA";
};

export const calculateSurveyScore = (
  surveyName: SurveyName,
  surveyScores: SurveyScore[]
): string => {
  if (!surveyScores) return;
  let score = 0;
  switch (surveyName) {
    case SurveyName.HARK:
      break;
  }
  return score.toString();
};

export const prepareSurveySubmission = () => {};
