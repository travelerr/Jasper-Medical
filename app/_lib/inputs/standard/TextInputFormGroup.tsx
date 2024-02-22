import React from "react";
import { ErrorMessage } from "@hookform/error-message"; // Assuming you are using react-hook-form for form handling
import { Tooltip } from "flowbite-react";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";
interface ITextInputFormGroup {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  pattern?: RegExp;
  patternMessage?: string;
  formIdentifier: string;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  labelText?: string;
  tooltipText?: string;
  leftIcon?: React.ReactNode; // Assuming these can be any React node (e.g., icons)
  rightIcon?: React.ReactNode;
  inputClasses?: string;
  formClasses?: string;
  extraOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderKey?: string;
  placeholderText?: string;
  placeholderFallback?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  isEmail?: boolean;
  isPhone?: boolean;
  isFax?: boolean;
  isUsername?: boolean;
  isPassword?: boolean;
}

export default function TextInputFormGroup(props: ITextInputFormGroup) {
  const {
    register,
    errors,
    pattern,
    patternMessage,
    formIdentifier,
    disabled,
    required,
    requiredMessage,
    labelText,
    tooltipText,
    leftIcon,
    rightIcon,
    inputClasses,
    formClasses,
    extraOnChange,
    placeholderKey,
    placeholderText,
    placeholderFallback,
    minLength,
    minLengthMessage,
    maxLength,
    maxLengthMessage,
    isEmail,
    isPhone,
    isFax,
    isUsername,
    isPassword,
  } = props;

  // Construct the validation object for react-hook-form
  const validationRules: RegisterOptions = {
    required: required ? requiredMessage || "This field is required" : false,
    pattern: pattern ? { value: pattern, message: patternMessage } : undefined,
    minLength: minLength
      ? { value: minLength, message: minLengthMessage }
      : undefined,
    maxLength: maxLength
      ? { value: maxLength, message: maxLengthMessage }
      : undefined,
    validate: {
      ...(isEmail && {
        email: (value: string) =>
          !value || /^\S+@\S+\.\S+$/.test(value) || "Invalid email address",
      }),
      ...(isPhone && {
        phone: (value: string) =>
          !value || /^\+?(\d.*){3,}$/.test(value) || "Invalid phone number",
      }),
      ...(isFax && {
        fax: (value: string) =>
          !value || /^\+?(\d.*){3,}$/.test(value) || "Invalid fax number",
      }),
      ...(isUsername && {
        username: (value: string) =>
          !value || /^[a-zA-Z0-9_.-]*$/.test(value) || "Invalid username",
      }),
      ...(isPassword && {
        pas: (value: string) =>
          !value || /^[a-zA-Z0-9_.-]*$/.test(value) || "Invalid username",
      }),
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (extraOnChange) {
      extraOnChange(e);
    }
    // You can add more logic here if needed
  };

  const placeholder =
    placeholderKey || placeholderText || placeholderFallback || "";

  return (
    <div className={formClasses || "form-group"}>
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
        {leftIcon && (
          <div className="input-group-prepend">
            <span className="input-group-text">{leftIcon}</span>
          </div>
        )}
        <input
          type={isPassword ? "password" : "text"}
          id={formIdentifier}
          name={formIdentifier}
          disabled={disabled}
          placeholder={placeholder}
          {...register(formIdentifier, validationRules)}
          onChange={handleChange}
          className={`form-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
            ${inputClasses ?? ""} ${
              errors[formIdentifier] ? "is-invalid" : ""
            }`}
          minLength={minLength}
          maxLength={maxLength}
        />
        {rightIcon && (
          <div className="input-group-append">
            <span className="input-group-text">{rightIcon}</span>
          </div>
        )}
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
