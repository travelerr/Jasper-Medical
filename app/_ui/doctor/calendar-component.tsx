"use client";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useCallback, useState } from "react";
import { CreateAppointmentModal } from "@/app/_ui/create-appointment-modal";
import { EditAppointmentModal } from "@/app/_ui/edit-appointment-modal";
import { EditAppointment } from "@/app/_lib/definitions";

interface ICalendarComponent {
  appointments: any[];
  patients: any[];
  currentUserId: number;
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

const localizer = momentLocalizer(moment);

export default function CalendarComponent(props: ICalendarComponent) {
  const { appointments, patients, currentUserId } = props;
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<ISlot>();
  const [aptToEdit, setAptToEdit] = useState<EditAppointment>();

  const handleSelectSlot = useCallback((slotInfo: any) => {
    setSelectedSlot(slotInfo);
    setOpenCreateModal(true);
  }, []);

  const onSelectEvent = useCallback((calEvent: EditAppointment) => {
    setAptToEdit(calEvent);
    setOpenEditModal(true);
  }, []);

  return (
    <div>
      <CreateAppointmentModal
        setOpenCreateModal={setOpenCreateModal}
        openCreateModal={openCreateModal}
        dismissible={true}
        patients={patients}
        slotInfo={selectedSlot}
      ></CreateAppointmentModal>
      <EditAppointmentModal
        setOpenEditModal={setOpenEditModal}
        openEditModal={openEditModal}
        dismissible={true}
        patients={patients}
        aptToEdit={aptToEdit}
        currentUserId={currentUserId}
      ></EditAppointmentModal>
      <BigCalendar
        selectable
        localizer={localizer}
        events={appointments}
        defaultView={Views.MONTH}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        defaultDate={new Date()}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
}
