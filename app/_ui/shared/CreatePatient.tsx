import { createUserAndPatient } from "@/app/_lib/actions";
import useViewState from "@/app/_lib/customHooks/useViewState";
import { ActionResponse, CreatePatientInputs } from "@/app/_lib/definitions";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";
import SelectInputFormGroup from "@/app/_lib/inputs/standard/SelectInputFormGroup";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import {
  ECRelationship,
  Ethnicity,
  Gender,
  GenderMarker,
  NameSuffix,
  PhoneType,
  Pronouns,
  Race,
  Sex,
  State,
} from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingOverlay from "./loadingWidget";
import PharmacyLookup from "@/app/_lib/inputs/lookups/PharmacyLookup";
import CheckboxInputFormGroup from "@/app/_lib/inputs/standard/CheckboxInputFormGroup";
import { useState } from "react";
import { ActionResponseMessage } from "./ActionResponseMessage";

export default function CreatePatient() {
  const { viewState, setLoading } = useViewState();
  const [submissionResponse, setSubmissionResponse] =
    useState<ActionResponse>();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePatientInputs>();

  const onSubmit: SubmitHandler<CreatePatientInputs> = async (data) => {
    try {
      setLoading(true);
      const result = await createUserAndPatient(data);
      setSubmissionResponse(result);
      setLoading(false);
      if (result.actionSuceeded) {
        reset();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const selectedPharmacy = (pharmacy: google.maps.places.PlaceResult) => {
    setValue("contact.pharmacy", pharmacy.name);
  };

  const selectedSecondaryPharmacy = (
    pharmacy: google.maps.places.PlaceResult
  ) => {
    setValue("contact.secondaryPharmacy", pharmacy.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoadingOverlay isLoading={viewState.loading} />
      <div className="w-full">
        {/* Auth */}
        <div className="flex gap-10 pb-10">
          <div id="demographics" className="w-1/4">
            <div className="uppercase font-bold">Email</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="email"
                required={true}
                isEmail={true}
                tooltipText="The patient will use this email to log into the portal"
                labelText="Email"
              />
              <CheckboxInputFormGroup
                register={register}
                errors={errors}
                inputClasses="p-5"
                formIdentifier="sendEmail"
                labelText="Send portal welcome email"
                tooltipText="This will send an email to the patient to create a password that is valid for 30 days"
              />
            </div>
          </div>
        </div>
        {/* Demographics */}
        <div className="flex gap-10 pb-10">
          <div id="demographics" className="w-1/4">
            <div className="uppercase font-bold">Demographics</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-4">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="firstName"
                required={true}
                labelText="First Name"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="middleName"
                labelText="Middle Name"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="lastName"
                required={true}
                labelText="Last Name"
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="suffix"
                required={false}
                labelText="Suffix"
                options={NameSuffix}
                nullOptionLabel={"Select"}
                defaultValue={null}
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <DatePickerFormGroup
                control={control}
                errors={errors}
                formIdentifier="dob"
                required={true}
                labelText="DOB"
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="sexAtBirth"
                required={true}
                labelText="Sex"
                options={Sex}
                nullOptionLabel={"Select"}
                defaultValue={null}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="gender"
                required={true}
                labelText="Gender"
                options={Gender}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
                defaultValue={null}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="genderMarker"
                required={false}
                labelText="Gender Marker"
                options={GenderMarker}
                nullOptionLabel={"Select"}
                defaultValue={null}
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="race"
                required={false}
                labelText="Race"
                options={Race}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
                defaultValue={null}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="pronouns"
                required={false}
                labelText="Pronouns"
                options={Pronouns}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
                defaultValue={null}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="ethnicity"
                required={false}
                labelText="Ethnicity"
                options={Ethnicity}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
                defaultValue={null}
              />
            </div>
          </div>
        </div>
        {/* Pharmacy */}
        <div className="flex gap-10 pb-10">
          <div id="pharmacy" className="w-1/4">
            <div className="uppercase font-bold">Pharmacy</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <PharmacyLookup
                onSelect={selectedPharmacy}
                labelText={"Pharmacy"}
              />
              <PharmacyLookup
                onSelect={selectedSecondaryPharmacy}
                labelText={"Secondary Pharmacy"}
              />
            </div>
          </div>
        </div>
        {/* Insurance */}
        <div className="flex gap-10 pb-10">
          <div id="pharmacy" className="w-1/4">
            <div className="uppercase font-bold">Insurance</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <PharmacyLookup
                onSelect={selectedPharmacy}
                labelText={"Pharmacy"}
              />
              <PharmacyLookup
                onSelect={selectedSecondaryPharmacy}
                labelText={"Secondary Pharmacy"}
              />
            </div>
          </div>
        </div>
        {/* Provider */}
        <div className="flex gap-10 pb-10">
          <div id="pharmacy" className="w-1/4">
            <div className="uppercase font-bold">Provider</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <PharmacyLookup
                onSelect={selectedPharmacy}
                labelText={"Pharmacy"}
              />
              <PharmacyLookup
                onSelect={selectedSecondaryPharmacy}
                labelText={"Secondary Pharmacy"}
              />
            </div>
          </div>
        </div>
        {/* Contact */}
        <div className="flex gap-10 pb-10">
          <div id="contact" className="w-1/4">
            <div className="uppercase font-bold">Contact</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.primaryPhone"
                required={true}
                labelText="Phone"
                isPhone={true}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="contact.primaryPhoneType"
                required={true}
                labelText="Type"
                options={PhoneType}
                nullOptionLabel={"Select"}
                defaultValue={null}
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryPhone"
                labelText="Secondary Phone"
                isPhone={true}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="contact.secondaryPhoneType"
                labelText="Type"
                options={PhoneType}
                nullOptionLabel={"Select"}
                defaultValue={null}
              />
            </div>
          </div>
        </div>
        {/* Address */}
        <div className="flex gap-10 pb-10">
          <div id="address" className="w-1/4">
            <div className="uppercase font-bold">Address</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.street"
                labelText="Street"
                required={true}
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.apt"
                labelText="Apt / Street 2"
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.city"
                labelText="City"
                required={true}
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="contact.state"
                labelText="State"
                options={State}
                nullOptionLabel={"Select"}
                required={true}
                defaultValue={null}
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.zip"
                labelText="Zip"
                required={true}
              />
            </div>
          </div>
        </div>
        {/* Secondary Address */}
        <div className="flex gap-10 pb-10">
          <div id="secondaryAddress" className="w-1/4">
            <div className="uppercase font-bold">Secondary Address</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryStreet"
                labelText="Street"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryApt"
                labelText="Apt / Street 2"
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryCity"
                labelText="City"
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="contact.secondaryState"
                labelText="State"
                options={State}
                nullOptionLabel={"Select"}
                defaultValue={null}
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryZip"
                labelText="Zip"
              />
            </div>
          </div>
        </div>
        {/* Emergency Contact */}
        <div className="flex gap-10 pb-10">
          <div id="ec" className="w-1/4">
            <div className="uppercase font-bold">Emergency Contact</div>
          </div>
          <div className="w-full">
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.ecFirstName"
                labelText="First Name"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.ecLastName"
                labelText="Last Name"
              />
              <SelectInputFormGroup
                control={control}
                errors={errors}
                formIdentifier="contact.ecRelationship"
                labelText="Relationship"
                options={ECRelationship}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
                defaultValue={null}
              />
            </div>
            <div className="w-full">
              <div className="grid gap-6 mb-6 md:grid-cols-3">
                <TextInputFormGroup
                  register={register}
                  errors={errors}
                  formIdentifier="contact.ecStreet"
                  labelText="Street"
                />
                <TextInputFormGroup
                  register={register}
                  errors={errors}
                  formIdentifier="contact.ecApt"
                  labelText="Apt / Street 2"
                />
                <TextInputFormGroup
                  register={register}
                  errors={errors}
                  formIdentifier="contact.ecPhone"
                  isPhone={true}
                  labelText="Phone"
                />
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-3">
                <TextInputFormGroup
                  register={register}
                  errors={errors}
                  formIdentifier="contact.ecCity"
                  labelText="City"
                />
                <SelectInputFormGroup
                  control={control}
                  errors={errors}
                  formIdentifier="contact.ecState"
                  labelText="State"
                  options={State}
                  nullOptionLabel={"Select"}
                  defaultValue={null}
                />
                <TextInputFormGroup
                  register={register}
                  errors={errors}
                  formIdentifier="contact.ecZip"
                  labelText="Zip"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button className="btn-primary" type="submit">
            Submit
          </button>
          <div className="w-full text-center">
            {submissionResponse && (
              <ActionResponseMessage actionResponse={submissionResponse} />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
