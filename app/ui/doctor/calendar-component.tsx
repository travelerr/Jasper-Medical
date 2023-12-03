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
  const [myEvents, setEvents] = useState(appointments);
  const [slotInfo, setSlotInfo] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [openModal, setOpenModal] = useState(false);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSlotInfo({ start, end }); // Save the slot info
      setOpenModal(true); // Open the modal
    },
    []
  );

  const handleModalClose = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleModalSubmit = useCallback(
    (title: string) => {
      if (title) {
        setEvents((prev) => [
          ...prev,
          { start: slotInfo.start, end: slotInfo.end, title },
        ]);
      }
      handleModalClose();
    },
    [slotInfo, setEvents]
  );

  return (
    <div className="lg:h-screen">
      {/* @TODO - if theres one one apt this will error */}
      <CreateAppointmentModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        slotInfo={slotInfo}
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
      />
    </div>
    // <div className="w-full md:col-span-4">
    //   <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
    //     Calendar
    //   </h2>
    //   <div className="rounded-xl bg-gray-50 p-4">
    //     <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
    //       <div
    //         className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
    //         style={{ height: `${chartHeight}px` }}
    //       >
    //         {yAxisLabels.map((label) => (
    //           <p key={label}>{label}</p>
    //         ))}
    //       </div>

    //       {revenue.map((month) => (
    //         <div key={month.month} className="flex flex-col items-center gap-2">
    //           <div
    //             className="w-full rounded-md bg-blue-300"
    //             style={{
    //               height: `${(chartHeight / topLabel) * month.revenue}px`,
    //             }}
    //           ></div>
    //           <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
    //             {month.month}
    //           </p>
    //         </div>
    //       ))}
    //     </div>
    //     <div className="flex items-center pb-2 pt-6">
    //       <CalendarIcon className="h-5 w-5 text-gray-500" />
    //       <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
    //     </div>
    //   </div>
    // </div>
  );
}
