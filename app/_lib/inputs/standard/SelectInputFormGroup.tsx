import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors, Control, Controller } from "react-hook-form";
import { covertPascalCase } from "../../utils";

interface ISelectOption {
  label: string;
  value: string | number;
}

type SelectOptionsInput = ISelectOption[] | Record<string, string | number>;

interface ISelectInputFormGroup {
  control: Control<any>; // Updated to use Control type
  errors?: FieldErrors<any>;
  formIdentifier: string;
  disabled?: boolean;
  required?: boolean;
  labelText?: string;
  selectClasses?: string;
  formClasses?: string;
  options: SelectOptionsInput;
  defaultValue?: string | number | null;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  nullOptionLabel?: string;
  parseHumanReadable?: boolean;
}

export default function SelectInputFormGroup(props: ISelectInputFormGroup) {
  const {
    control,
    errors,
    formIdentifier,
    disabled,
    required,
    labelText,
    selectClasses,
    formClasses,
    options,
    defaultValue,
    onChange,
    nullOptionLabel = "Select an option",
    parseHumanReadable,
  } = props;

  const transformOptions = (options: SelectOptionsInput): ISelectOption[] => {
    if (Array.isArray(options)) {
      return options;
    } else {
      return Object.entries(options).map(([label, value]) => ({
        label: label,
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
      <Controller
        name={formIdentifier}
        control={control}
        defaultValue={defaultValue || null}
        rules={{ required }}
        render={({ field }: { field: any }) => (
          <select
            {...field}
            id={formIdentifier}
            disabled={disabled}
            onChange={(e) => {
              field.onChange(e.target.value === "" ? null : e.target.value);
              if (onChange) {
                onChange(e);
              }
            }}
            className={`form-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg ${
              selectClasses ?? ""
            } ${errors[formIdentifier] ? "is-invalid" : ""}`}
          >
            {nullOptionLabel && <option value="">{nullOptionLabel}</option>}
            {transformedOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {parseHumanReadable
                  ? covertPascalCase(option.label)
                  : option.label}
              </option>
            ))}
          </select>
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
}
