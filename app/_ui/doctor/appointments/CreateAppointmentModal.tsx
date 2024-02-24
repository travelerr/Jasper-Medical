"use client";
import { Button, Modal as FlowBiteModal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiX } from "react-icons/hi";
import { createAppointment } from "@/app/_lib/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { isStartBeforeEnd } from "../../../_lib/utils";
import { CreateAppointmentInputs } from "../../../_lib/definitions";
import { useEffect, useState } from "react";
import useViewState from "../../../_lib/customHooks/useViewState";
import LoadingOverlay from "../../shared/loadingWidget";
import TextInputFormGroup from "@/app/_lib/inputs/standard/TextInputFormGroup";
import PatientLookup from "@/app/_lib/inputs/lookups/PatientLookup";
import { Patient } from "@prisma/client";
import DatePickerFormGroup from "@/app/_lib/inputs/standard/DatePickerFormGroup";
import TextAreaInputFormGroup from "@/app/_lib/inputs/standard/TextAreaInputFormGroup";
import TimePickerFormGroup from "@/app/_lib/inputs/standard/TimePickerFormGroup";

interface ICreateAppointmentModalProps {
  openCreateModal: boolean;
  setOpenCreateModal: Function;
  slotInfo: ISlot;
}
interface ISlot {
  slots: string[];
  start: string;
  end: string;
  resourceId: null | number | string; // Assuming resourceId can be either null, number, or string.
  action: string;
  bounds: {
    top: number;
    left: number;
    x: number;
    y: number;
    right: number;
    bottom: number;
  };
}

export function CreateAppointmentModal(props: ICreateAppointmentModalProps) {
  const { openCreateModal, setOpenCreateModal, slotInfo } = props;
  const { viewState, setLoading } = useViewState();
  const [formMessage, setFormMessage] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateAppointmentInputs>();
  const onSubmit: SubmitHandler<CreateAppointmentInputs> = async (data) => {
    if (!validateDates()) {
      setFormMessage("Start date must come before end date.");
    }
    if (selectedPatient && selectedPatient.id) {
      data.patient = selectedPatient.id.toString();
    }
    try {
      setLoading(true);
      await createAppointment(data);
      setLoading(false);
      reset();
      setOpenCreateModal(false);
      setFormMessage("");
      router.refresh();
    } catch (error) {
      setFormMessage("There was an error creating the appointment");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotInfo) {
      const startDateTime = new Date(slotInfo.start);
      const endDateTime = new Date(slotInfo.end);

      const formatDate = (date: any) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are zero-indexed
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formatTime = (date: any) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      setValue("startDate", formatDate(startDateTime));
      setValue("startTime", formatTime(startDateTime));
      setValue("endDate", formatDate(endDateTime));
      setValue("endTime", formatTime(endDateTime));
    }
  }, [slotInfo]);

  const startDate = watch("startDate");
  const startTime = watch("startTime");
  const endDate = watch("endDate");
  const endTime = watch("endTime");

  const validateDates = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      return true; // No validation if one of the dates is missing
    }
    return isStartBeforeEnd(startDate, startTime, endDate, endTime);
  };

  const handleSelectedPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <FlowBiteModal
      size={"7xl"}
      show={openCreateModal}
      className="relative"
      onClose={() => setOpenCreateModal(false)}
    >
      <FlowBiteModal.Header>Add an appointment</FlowBiteModal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlowBiteModal.Body>
          <LoadingOverlay isLoading={viewState.loading} />
          <div>
            {formMessage && (
              <p
                className={`${
                  formMessage.includes("Success")
                    ? "text-green-500"
                    : "text-red-500"
                } pb-4`}
              >
                {formMessage}
              </p>
            )}
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <TextInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="title"
              required={true}
              labelText="Appointment Title"
            />
            {selectedPatient ? (
              <div>
                <div className="flex w-full border-b">
                  <div className="w-11/12 font-bold">Patient</div>
                  <div className="w-1/12 font-bold">DOB</div>
                </div>
                <div className="flex w-full text-left">
                  <div className="w-8/12">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </div>
                  <div className="w-4/12 text-right">
                    {selectedPatient.dob.toDateString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                  >
                    <HiX className="text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <PatientLookup callback={handleSelectedPatient} />
            )}
            <DatePickerFormGroup
              control={control}
              errors={errors}
              formIdentifier="startDate"
              required={true}
              labelText="Start Date"
            />
            <DatePickerFormGroup
              control={control}
              errors={errors}
              formIdentifier="endDate"
              required={true}
              labelText="End Date"
            />
            <TimePickerFormGroup
              control={control}
              errors={errors}
              formIdentifier="startTime"
              required={true}
              labelText="Start Time"
            />
            <TimePickerFormGroup
              control={control}
              errors={errors}
              formIdentifier="endTime"
              required={true}
              labelText="End Time"
            />
            <TextAreaInputFormGroup
              register={register}
              errors={errors}
              formIdentifier="details"
              labelText="Details"
            />
          </div>
        </FlowBiteModal.Body>
        <FlowBiteModal.Footer>
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
