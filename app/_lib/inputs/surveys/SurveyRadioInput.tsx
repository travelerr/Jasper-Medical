import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface ISurveyRadioInput {
  questionText: string;
  questionId: number;
  register: Function; // Assume register is a function provided by useForm
  radioOptions: RadioOption[];
}

export default function SurveyRadioInput({
  questionText,
  questionId,
  register,
  radioOptions,
}: ISurveyRadioInput) {
  return (
    <div className="flex flex-col">
      <div className="text-lg">{questionText}</div>
      {radioOptions.map((option) => (
        <label key={option.value} className="m-1">
          <input
            type="radio"
            className="mr-3"
            value={option.value}
            {...register(`${questionId}`)} // Register function used directly
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
