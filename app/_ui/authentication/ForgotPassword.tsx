"use client";
import { MdOutlineAlternateEmail } from "react-icons/md";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { sendResetPasswordEmailWithJWT } from "@/app/_lib/actions";
import useViewState from "@/app/_lib/customHooks/useViewState";
import LoadingOverlay from "../shared/loadingWidget";
import { ActionResponse } from "@/app/_lib/definitions";
import { ActionResponseMessage } from "../shared/ActionResponseMessage";

export default function ForgotPassword() {
  const [submissionResponse, setSubmissionResponse] =
    useState<ActionResponse>();
  const { viewState, setLoading } = useViewState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onSubmit: SubmitHandler<{
    email: string;
  }> = async (data) => {
    try {
      setLoading(true);
      const result = await sendResetPasswordEmailWithJWT({
        email: data.email,
      });
      if (result.actionSuceeded) {
        reset();
      }
      setSubmissionResponse(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <LoadingOverlay isLoading={viewState.loading} />
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>Enter email</h1>
        <div className="w-full">
          <TextInputFormGroup
            register={register}
            formClasses="mb-5"
            errors={errors}
            formIdentifier="email"
            required={true}
            labelText="Enter Email"
            isEmail={true}
            leftIcon={
              <MdOutlineAlternateEmail className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
            }
          />
        </div>
        <button className="btn-primary-md flex items-center w-full justify-center mt-10">
          Forgot Password{" "}
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
        {submissionResponse && (
          <ActionResponseMessage actionResponse={submissionResponse} />
        )}
      </div>
    </form>
  );
}
