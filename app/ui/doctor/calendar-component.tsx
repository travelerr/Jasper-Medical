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
import { CreateAppointmentModal } from "@/app/ui/create-appointment-modal";

interface ICalendarComponent {
  appointments: any[];
  patients: any[];
}

const localizer = momentLocalizer(moment);

export default function CalendarComponent(props: ICalendarComponent) {
  const { appointments, patients } = props;
  const [openModal, setOpenModal] = useState(false);

  const handleSelectSlot = useCallback(() => {
    setOpenModal(true);
  }, []);

  const onSelectEvent = useCallback((calEvent: any) => {
    console.log(calEvent);
    window.alert("onSelectEvent");
  }, []);

  return (
    <div className="lg:h-screen">
      {/* @TODO - if theres one one apt this will error */}
      <CreateAppointmentModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        dismissible={true}
        patients={patients}
      ></CreateAppointmentModal>
      <BigCalendar
        selectable
        localizer={localizer}
        events={appointments}
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        defaultDate={new Date()}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
}
