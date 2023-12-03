"use client";
import {
  Button,
  Datepicker,
  TextInput,
  Label,
  Select,
  Modal as FlowBiteModal,
  Textarea,
} from "flowbite-react";
import { useFormState } from "react-dom";
import { createAppointment } from "@/app/lib/actions";

interface ICreateAppointmentModalProps {
  openModal: boolean;
  dismissible?: boolean;
  setOpenModal: Function;
  slotInfo: {
    start: Date;
    end: Date;
  };
  patients: any[];
}

export function CreateAppointmentModal(props: ICreateAppointmentModalProps) {
  const { openModal, dismissible, setOpenModal, slotInfo, patients } = props;
  const [state, dispatch] = useFormState(createAppointment, undefined);

  return (
    <FlowBiteModal
      size={"7xl"}
      dismissible={dismissible}
      show={openModal}
      onClose={() => setOpenModal(false)}
    >
      <FlowBiteModal.Header>Add an appointment</FlowBiteModal.Header>
      <form action={dispatch}>
        <FlowBiteModal.Body>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label htmlFor="title" value="Appointment Title" />
              <TextInput id="title" name="title" required={true} />
            </div>
            <div>
              <Label htmlFor="patient" value="Patients" />
              <Select id="patient" name="patient" required>
                {patients.map((user, index) => (
                  <option key={index} value={`${user.id}`}>
                    {`${user.firstName} ${user.lastName}`}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate" value="Start Date" />
              <Datepicker id="startDate" name="startDate" />
            </div>
            <div>
              <Label htmlFor="endDate" value="End Date" />
              <Datepicker id="endDate" name="endDate" />
            </div>
            <div>
              <Label htmlFor="startTime" value="Start Time" />
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime" value="End Time" />
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes" value="Notes" />
              <Textarea id="notes" name="notes" />
            </div>
            <div>
              <Label htmlFor="details" value="Details" />
              <Textarea id="details" name="details" />
            </div>
          </div>
        </FlowBiteModal.Body>
        <FlowBiteModal.Footer>
          <Button type="submit">Submit</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </FlowBiteModal.Footer>
      </form>
    </FlowBiteModal>
  );
}
