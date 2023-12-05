import { Suspense } from "react";
import DashboardSkeleton from "@/app/ui/skeletons";
import { auth } from "../../../auth";
import CalendarComponent from "@/app/ui/doctor/calendar-component";
import { getAppointmentsByUserID, getPatients } from "@/app/lib/data";
import {
  formatAppointmentsForCalendar,
  formatPatientsForCalendar,
} from "@/app/lib/utils";

export default async function Page() {
  const session = await auth();
  let appointments = await getAppointmentsByUserID(Number(session?.user.id));
  appointments = formatAppointmentsForCalendar(appointments);
  let patients = await getPatients();
  patients = formatPatientsForCalendar(patients);

  return (
    <main>
      <div className="h-full">
        <Suspense fallback={<DashboardSkeleton />}>
          <CalendarComponent appointments={appointments} patients={patients} />
        </Suspense>
      </div>
    </main>
  );
}
