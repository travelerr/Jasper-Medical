"use client";
import {
  Button,
  TextInput,
  Label,
  Select,
  Textarea,
  Modal as FlowBiteModal,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/app/_lib/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { isStartBeforeEnd } from "../_lib/utils";
import { CreateAppointmentInputs } from "../_lib/definitions";
import { useEffect, useState } from "react";
import useViewState from "../_lib/customHooks/useViewState";
import LoadingOverlay from "./loadingWidget";

interface ICreateAppointmentModalProps {
  openCreateModal: boolean;
  dismissible?: boolean;
  setOpenCreateModal: Function;
  patients: any[];
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
  const {
    openCreateModal,
    dismissible,
    setOpenCreateModal,
    patients,
    slotInfo,
  } = props;
  const { viewState, setLoading } = useViewState();
  const [formMessage, setFormMessage] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAppointmentInputs>();
  const onSubmit: SubmitHandler<CreateAppointmentInputs> = async (data) => {
    if (!validateDates()) {
      setFormMessage("Start date must come before end date.");
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
  }, [slotInfo, setValue]);

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

  return (
    <FlowBiteModal
      size={"7xl"}
      dismissible={dismissible}
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
            <div>
              <Label htmlFor="title" value="Appointment Title" />
              <TextInput
                id="title"
                {...register("title", { required: true })}
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {errors.title && <p>{errors.title.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="patient" value="Patients" />
              <Select id="patient" {...register("patient", { required: true })}>
                {patients.map((patient, index) => (
                  <option key={index} value={`${patient.id}`}>
                    {`${patient.firstName} ${patient.lastName}`}
                  </option>
                ))}
              </Select>
              <div id="patient-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.patient && <p>{errors.patient.message}</p>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label htmlFor="startDate" value="Start Date" />
              <input
                type="date"
                id="startDate"
                {...register("startDate")}
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
              />
              <div id="startDate-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.startDate && <p>{errors.startDate.message}</p>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label htmlFor="endDate" value="End Date" />
              <input
                id="endDate"
                type="date"
                {...register("endDate", {
                  required: true,
                })}
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
              />
              <div id="endDate-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.startDate && <p>{errors.startDate.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="startTime" value="Start Time" />
              <input
                type="time"
                id="startTime"
                {...register("startTime", {
                  required: true,
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <div id="startTime-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.startTime && <p>{errors.startTime.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="endTime" value="End Time" />
              <input
                type="time"
                id="endTime"
                {...register("endTime", {
                  required: true,
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <div id="endTime-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.endTime && <p>{errors.endTime.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="details" value="Details" />
              <Textarea
                id="details"
                {...register("details", { required: false })}
              />
              <div id="details-error" aria-live="polite" aria-atomic="true">
                {" "}
                {errors.details && <p>{errors.details.message}</p>}
              </div>
            </div>
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