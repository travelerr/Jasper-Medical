import { createUserAndPatient } from "@/app/_lib/actions";
import useViewState from "@/app/_lib/customHooks/useViewState";
import { CreatePatientInputs } from "@/app/_lib/definitions";
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

interface ICreatePatient {}
export default function CreatePatient(props: ICreatePatient) {
  const { viewState, setLoading } = useViewState();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePatientInputs>();

  const onSubmit: SubmitHandler<CreatePatientInputs> = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      await createUserAndPatient(data);
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                labelText="Email (Used for patient portal login)"
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
                register={register}
                errors={errors}
                formIdentifier="suffix"
                required={false}
                labelText="Suffix"
                options={NameSuffix}
                nullOptionLabel={"Select"}
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
                register={register}
                errors={errors}
                formIdentifier="sexAtBirth"
                required={true}
                labelText="Sex"
                options={Sex}
                nullOptionLabel={"Select"}
              />
              <SelectInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="gender"
                required={true}
                labelText="Gender"
                options={Gender}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
              />
              <SelectInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="genderMarker"
                required={false}
                labelText="Gender Marker"
                options={GenderMarker}
                nullOptionLabel={"Select"}
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <SelectInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="race"
                required={false}
                labelText="Race"
                options={Race}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
              />
              <SelectInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="pronouns"
                required={false}
                labelText="Pronouns"
                options={Pronouns}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
              />
              <SelectInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="ethnicity"
                required={false}
                labelText="Ethnicity"
                options={Ethnicity}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
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
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.pharmacy"
                labelText="Pharmacy"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryPharmacy"
                labelText="Secondary Pharmacy"
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
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.pharmacy"
                labelText="Pharmacy"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryPharmacy"
                labelText="Secondary Pharmacy"
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
            <div className="grid gap-6 mb-6 md:grid-cols-3">
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.pharmacy"
                labelText="Pharmacy"
              />
              <TextInputFormGroup
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryPharmacy"
                labelText="Secondary Pharmacy"
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
                register={register}
                errors={errors}
                formIdentifier="contact.primaryType"
                required={true}
                labelText="Type"
                options={PhoneType}
                nullOptionLabel={"Select"}
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
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryType"
                labelText="Type"
                options={PhoneType}
                nullOptionLabel={"Select"}
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
                register={register}
                errors={errors}
                formIdentifier="contact.state"
                labelText="State"
                options={State}
                nullOptionLabel={"Select"}
                required={true}
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
                register={register}
                errors={errors}
                formIdentifier="contact.secondaryState"
                labelText="State"
                options={State}
                nullOptionLabel={"Select"}
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
                register={register}
                errors={errors}
                formIdentifier="contact.ecRelationship"
                labelText="Relationship"
                options={ECRelationship}
                nullOptionLabel={"Select"}
                parseHumanReadable={true}
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
                  register={register}
                  errors={errors}
                  formIdentifier="contact.ecState"
                  labelText="State"
                  options={State}
                  nullOptionLabel={"Select"}
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
        <button className="btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
