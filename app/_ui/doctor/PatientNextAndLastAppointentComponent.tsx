import { PatientNextAndLastApt } from "@/app/_lib/definitions";
import { formatDateString, formatTimeString } from "@/app/_lib/utils";
import { Appointment } from "@prisma/client";
import { useEffect, useState } from "react";

interface IPatientNextAndLastAppointentComponentProps {
  appointments: Appointment[];
}

export default function IPatientNextAndLastAppointentComponentProps(
  props: IPatientNextAndLastAppointentComponentProps
) {
  const { appointments } = props;
  const [patientNextAndLastApt, setPatientNextAndLastApt] =
    useState<PatientNextAndLastApt>({
      lastApt: null,
      nextApt: null,
    });

  function findPatientNextAndLastApt() {
    if (!appointments) return;
    const now = new Date();

    // Filter and find the closest past appointment
    const pastAppointments = appointments
      .filter((appointment) => appointment.startTime < now)
      .sort((a: any, b: any) => b.startTime - a.startTime); // Sort in descending order
    const previousAppointment =
      pastAppointments.length > 0 ? pastAppointments[0] : null;

    // Filter and find the closest future appointment
    const futureAppointments = appointments
      .filter((appointment) => appointment.startTime > now)
      .sort((a: any, b: any) => a.startTime - b.startTime); // Sort in ascending order
    const upcomingAppointment =
      futureAppointments.length > 0 ? futureAppointments[0] : null;

    setPatientNextAndLastApt({
      lastApt: previousAppointment,
      nextApt: upcomingAppointment,
    });
  }

  useEffect(() => {
    findPatientNextAndLastApt();
  }, [appointments]);

  return (
    <div className="flex flex-col">
      {patientNextAndLastApt.lastApt ? (
        <div className="flex flex-col">
          <small>Prior appointment:</small>
          <small className="font-bold">
            {formatDateString(
              patientNextAndLastApt.lastApt?.startTime?.toDateString()
            )}{" "}
            {formatTimeString(
              patientNextAndLastApt.lastApt?.startTime?.getTime()
            )}
          </small>
        </div>
      ) : (
        <small>No prior appointments</small>
      )}
      {patientNextAndLastApt.nextApt ? (
        <div className="flex flex-col">
          <small>Upcoming appointment:</small>
          <small className="font-bold">
            {formatDateString(
              patientNextAndLastApt.nextApt?.startTime?.toDateString()
            )}{" "}
            {formatTimeString(
              patientNextAndLastApt.nextApt?.startTime?.getTime()
            )}
          </small>
        </div>
      ) : (
        <small>No upcoming appointments</small>
      )}
    </div>
  );
}
