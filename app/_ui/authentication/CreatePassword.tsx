"use client";
import { KeyIcon } from "@heroicons/react/24/outline";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updateUserPasswordWithJWT } from "@/app/_lib/actions";
import useViewState from "@/app/_lib/customHooks/useViewState";
import LoadingOverlay from "../shared/loadingWidget";
import { ActionResponse } from "@/app/_lib/definitions";
import { ActionResponseMessage } from "../shared/ActionResponseMessage";

export default function CreatePassword() {
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState<boolean>();
  const [tokenErrorMessage, setTokenErrorMessage] = useState<boolean>();
  const [redirectMessage, setRedirectMessage] = useState<boolean>();

  const [submissionResponse, setSubmissionResponse] =
    useState<ActionResponse>();
  const { viewState, setLoading } = useViewState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ password1: string; password2: string }>();

  const onSubmit: SubmitHandler<{
    password1: string;
    password2: string;
  }> = async (data) => {
    if (data.password1 !== data.password2) {
      setPasswordsDoNotMatch(true);
      setTimeout(() => {
        setPasswordsDoNotMatch(false);
      }, 5000);
      return;
    }
    if (!token) {
      setTokenErrorMessage(true);
      setTimeout(() => {
        setTokenErrorMessage(false);
      }, 5000);
    }
    try {
      setLoading(true);
      const result = await updateUserPasswordWithJWT({
        password: data.password1,
        token: token,
      });
      if (result.actionSuceeded) {
        setRedirectMessage(true);
        reset();
        setTimeout(() => {
          router.push("/authentication/login");
        }, 2000);
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
        <h1 className={`mb-3 text-2xl`}>Create your password.</h1>
        <div className="w-full">
          <TextInputFormGroup
            register={register}
            formClasses="mb-5"
            errors={errors}
            formIdentifier="password1"
            required={true}
            isPassword={true}
            labelText="Enter password"
            leftIcon={
              <KeyIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
            }
          />
          <TextInputFormGroup
            register={register}
            errors={errors}
            formIdentifier="password2"
            required={true}
            isPassword={true}
            labelText="Renter password"
            leftIcon={
              <KeyIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
            }
          />
        </div>
        <button className="btn-primary-md flex items-center w-full justify-center mt-10">
          Create Password{" "}
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
        {passwordsDoNotMatch ? (
          <span className="text-red-500">Passwords do not match</span>
        ) : null}
        {tokenErrorMessage ? (
          <span className="text-red-500">
            There was an error creating your password. Please contact the{" "}
            <a href={`mailto:${process.env.ADMIN_EMAIL}`} className="link">
              admin
            </a>
          </span>
        ) : null}
        {submissionResponse && (
          <ActionResponseMessage actionResponse={submissionResponse} />
        )}
        {redirectMessage ? (
          <span className="text-green-500">
            You will be redirected to the login page
          </span>
        ) : null}
      </div>
    </form>
  );
}
