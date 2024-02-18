interface ISurveyTextInput {
  trueOrFalse?: boolean;
  questionText: string;
}

export default function SurveyTextInput(props: ISurveyTextInput) {
  const { questionText } = props;
  return (
    <div>
      {questionText}
      <label htmlFor="yes">Yes</label>
      <input type="radio" id="yes" name="yesNo" value="Yes">
        {" "}
      </input>

      <label htmlFor="no">No</label>
      <input type="radio" id="no" name="yesNo" value="No"></input>
    </div>
  );
}
