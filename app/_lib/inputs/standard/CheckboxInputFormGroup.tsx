import React from "react";
import { ErrorMessage } from "@hookform/error-message"; // Assuming you are using react-hook-form for form handling
import { Tooltip } from "flowbite-react";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";
interface ICheckboxInputFormGroup {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  formIdentifier: string;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  labelText?: string;
  tooltipText?: string;
  inputClasses?: string;
  formClasses?: string;
  extraOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxInputFormGroup(props: ICheckboxInputFormGroup) {
  const {
    register,
    errors,
    formIdentifier,
    disabled,
    required,
    requiredMessage,
    labelText,
    tooltipText,
    inputClasses,
    formClasses,
    extraOnChange,
  } = props;

  // Construct the validation object for react-hook-form
  const validationRules: RegisterOptions = {
    required: required ? requiredMessage || "This field is required" : false,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (extraOnChange) {
      extraOnChange(e);
    }
    // You can add more logic here if needed
  };

  return (
    <div
      className={
        formClasses ||
        "form-group flex flex-col form-group items-center justify-center"
      }
    >
      {labelText && (
        <label htmlFor={formIdentifier}>
          {labelText}{" "}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      {tooltipText && (
        <Tooltip
          placement="right"
          className="in"
          id="tooltip-right"
          content={tooltipText}
        />
      )}
      <div className="input-group">
        <input
          type="checkbox"
          id={formIdentifier}
          name={formIdentifier}
          disabled={disabled}
          {...register(formIdentifier, validationRules)}
          className={`form-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
            ${inputClasses ?? ""} ${
              errors[formIdentifier] ? "is-invalid" : ""
            }`}
        />
        <ErrorMessage
          errors={errors}
          name={formIdentifier}
          render={({ message }) => (
            <div className="invalid-feedback text-red-500">{message}</div>
          )}
        />
      </div>
    </div>
  );
}
