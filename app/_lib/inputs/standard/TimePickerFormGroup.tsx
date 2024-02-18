import React from "react";
import { Controller, FieldErrors, Control } from "react-hook-form";
import TimePicker from "react-time-picker"; // Ensure you have this package or a similar one
import "react-time-picker/dist/TimePicker.css"; // Adjust the import based on the actual package
import { ErrorMessage } from "@hookform/error-message";

interface ITimePickerFormGroup {
  control: Control<any>;
  errors: FieldErrors<any>;
  formIdentifier: string;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  labelText?: string;
  placeholderText?: string;
  format?: string; // Time format, e.g., "HH:mm"
}

const TimePickerFormGroup: React.FC<ITimePickerFormGroup> = ({
  control,
  errors,
  formIdentifier,
  disabled,
  required,
  requiredMessage,
  labelText,
  placeholderText = "Select time...",
  format,
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
        rules={{
          required: required
            ? requiredMessage || "This field is required"
            : false,
        }}
        render={({ field }) => (
          <TimePicker
            {...field}
            value={field.value}
            onChange={field.onChange}
            format={format}
            disabled={disabled}
            disableClock={true}
            className={`form-control form-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5
              ${errors[formIdentifier] ? "is-invalid" : ""}`}
            clearIcon={null} // Adjust or remove based on your TimePicker component's props
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

export default TimePickerFormGroup;
