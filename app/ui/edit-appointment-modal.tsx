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
import { createAppointment } from "@/app/lib/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { isStartBeforeEnd } from "../lib/utils";
import { CreateAppointmentInputs, EditAppointment } from "../lib/definitions";
import { useEffect, useState } from "react";
import useViewState from "../lib/customHooks/useViewState";
import LoadingOverlay from "./loadingWidget";
import { deleteAppointmentByID } from "@/app/lib/data";
interface IEditAppointmentModalProps {
  openEditModal: boolean;
  dismissible?: boolean;
  setOpenEditModal: Function;
  patients: any[];
  aptToEdit: EditAppointment;
  currentUserId: number;
}

export function EditAppointmentModal(props: IEditAppointmentModalProps) {
  const {
    openEditModal,
    dismissible,
    setOpenEditModal,
    patients,
    aptToEdit,
    currentUserId,
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
      setFormMessage("Success, your appointment has been created");
      reset();
      setTimeout(() => {
        setOpenEditModal(false);
        setFormMessage("");
        router.refresh();
      }, 3000);
    } catch (error) {
      setFormMessage("There was an error creating the appointment");
      setLoading(false);
    }
  };

  async function deleteAppointment() {
    try {
      await deleteAppointmentByID(aptToEdit.id);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (aptToEdit) {
      const patient: any = aptToEdit.users.find(
        (x: any) => x.userId !== currentUserId
      );
      const startDateTime = new Date(aptToEdit.start);
      const endDateTime = new Date(aptToEdit.end);
      setValue("startDate", startDateTime.toISOString().substring(0, 10));
      setValue("startTime", startDateTime.toISOString().substring(11, 16));
      setValue("endDate", endDateTime.toISOString().substring(0, 10));
      setValue("endTime", endDateTime.toISOString().substring(11, 16));
      setValue("title", aptToEdit.title);
      setValue("patient", patient.userId.toString());
      setValue("details", aptToEdit.details);
    }
  }, [aptToEdit, setValue]);

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
      show={openEditModal}
      className="relative"
      onClose={() => setOpenEditModal(false)}
    >
      <FlowBiteModal.Header>Edit appointment</FlowBiteModal.Header>
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
                {patients.map((user, index) => (
                  <option key={index} value={`${user.id}`}>
                    {`${user.firstName} ${user.lastName}`}
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
          <Button type="submit">Update</Button>
          <Button color="gray" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => deleteAppointment()}>
            Delete Appointment
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
