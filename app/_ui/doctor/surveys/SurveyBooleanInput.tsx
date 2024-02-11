interface ISurveyBooleanInput {
  yesOrNo?: boolean;
  questionText: string;
  questionId: number;
  register?: Function;
}

export default function SurveyBooleanInput(props: ISurveyBooleanInput) {
  const { questionText, questionId, yesOrNo, register } = props;
  // Unique IDs for each radio button
  const yesId = `yes-${questionId}`;
  const noId = `no-${questionId}`;

  return (
    <div>
      <div className="text-lg">{questionText}</div>
      <div className="mt-3">
        <label className="m-1" htmlFor={yesId}>
          {yesOrNo ? "Yes" : "True"}
        </label>
        <input
          type="radio"
          className="m-1"
          id={yesId}
          name={`${questionId}`}
          value="true"
          {...(register && register(`${questionId}`))}
        />
        <label className="m-1" htmlFor={noId}>
          {yesOrNo ? "No" : "False"}
        </label>
        <input
          type="radio"
          className="m-1"
          id={noId}
          name={`${questionId}`}
          value="false"
          {...(register && register(`${questionId}`))}
        />
      </div>
    </div>
  );
}
