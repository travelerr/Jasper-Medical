import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { covertPascalCase } from "../../utils";

interface ISelectOption {
  label: string;
  value: string | number;
}

// This allows for the input to be an object where keys are the labels and values are the corresponding values
type SelectOptionsInput = ISelectOption[] | Record<string, string | number>;

interface ISelectInputFormGroup {
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  formIdentifier: string;
  disabled?: boolean;
  required?: boolean;
  labelText?: string;
  selectClasses?: string;
  formClasses?: string;
  options: SelectOptionsInput;
  defaultValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  nullOptionLabel?: string;
  parseHumanReadable?: boolean;
}

// Assuming usage of react-hook-form and similar prop needs
export default function SelectInputFormGroup(props: ISelectInputFormGroup) {
  const {
    register,
    setValue,
    errors,
    formIdentifier,
    disabled,
    required,
    labelText,
    selectClasses,
    formClasses,
    options, // Array of options
    defaultValue,
    onChange, // Additional onChange handler
    nullOptionLabel,
    parseHumanReadable,
  } = props;

  useEffect(() => {
    if (setValue) {
      setValue(formIdentifier, null);
    }
  }, [register, setValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
    // Add more logic here if needed
  };

  const transformOptions = (options: SelectOptionsInput): ISelectOption[] => {
    if (Array.isArray(options)) {
      // Already in the correct format
      return options;
    } else {
      // Transform the object into an array of options
      return Object?.entries(options).map(([label, value]) => ({
        label: label, // Or some other transformation if needed
        value: value,
      }));
    }
  };

  const transformedOptions = transformOptions(options);

  return (
    <div className={formClasses || "form-group"}>
      {labelText && (
        <label htmlFor={formIdentifier}>
          {labelText}{" "}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <select
        id={formIdentifier}
        name={formIdentifier}
        disabled={disabled}
        defaultValue={defaultValue}
        {...register(formIdentifier, { required })}
        onChange={handleChange}
        className={`form-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
          ${selectClasses ?? ""} ${errors[formIdentifier] ? "is-invalid" : ""}`}
      >
        {nullOptionLabel && <option value="">{nullOptionLabel}</option>}
        {transformedOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {parseHumanReadable ? covertPascalCase(option.label) : option.label}
          </option>
        ))}
      </select>
      <ErrorMessage
        errors={errors}
        name={formIdentifier}
        render={({ message }) => (
          <div className="invalid-feedback text-red-500">{message}</div>
        )}
      />
    </div>
  );
}
