import React from "react";
import { Controller, FieldErrors, Control } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage } from "@hookform/error-message";

interface IDatePickerFormGroup {
  control: Control<any>; // Add Control type
  errors: FieldErrors<any>;
  formIdentifier: string;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  labelText?: string;
  placeholderText?: string;
  dateFormat?: string;
}

const DatePickerFormGroup: React.FC<IDatePickerFormGroup> = ({
  control,
  errors,
  formIdentifier,
  disabled,
  required,
  requiredMessage,
  labelText,
  placeholderText = "Select date...",
  dateFormat = "MMMM d, yyyy",
}) => {
  return (
    <div className="form-group flex flex-col">
      {labelText && (
        <label htmlFor={formIdentifier}>
          {labelText}{" "}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <Controller
        name={formIdentifier}
        control={control}
        defaultValue={null}
        rules={{
          required: required
            ? requiredMessage || "This field is required"
            : false,
        }}
        render={({ field }) => (
          <DatePicker
            {...field}
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            dateFormat={dateFormat}
            placeholderText={placeholderText}
            disabled={disabled}
            className={`form-control form-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
              ${errors[formIdentifier] ? "is-invalid" : ""}`}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name={formIdentifier}
        render={({ message }) => (
          <div className="invalid-feedback text-red-500">{message}</div>
        )}
      />
    </div>
  );
};

export default DatePickerFormGroup;
