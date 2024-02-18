interface ISurveyNumberInput {
  questionText: string;
  questionId: number;
  register: Function;
  min?: number;
  max?: number;
}

export default function SurveyNumberInput(props: ISurveyNumberInput) {
  const { questionText, questionId, register, min, max } = props;
  return (
    <div className="flex items-center w-full justify-between">
      <div className="w-3/4">{questionText}</div>{" "}
      <div className="flex items-center">
        <small className="ml-3">{`(${min} - ${max})`}</small>
        <input
          className="h-5 ml-3 w-14"
          type="number"
          {...register(`${questionId}`, { max: max, min: min })}
        />
      </div>
    </div>
  );
}
