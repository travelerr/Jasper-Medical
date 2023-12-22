import { Suspense } from "react";
import DashboardSkeleton from "@/app/_ui/skeletons";
import { auth } from "../../../auth";
import CalendarComponent from "@/app/_ui/doctor/calendar-component";
import { getPatients, getAppointmentsByUserID } from "@/app/_lib/data";
import { formatAppointmentsForCalendar } from "@/app/_lib/utils";

export default async function Page() {
  const session = await auth();
  let appointments = await getAppointmentsByUserID(Number(session?.user.id));
  appointments = formatAppointmentsForCalendar(appointments);
  let patients = await getPatients();

  return (
    <main>
      <div className="h-full">
        <Suspense fallback={<DashboardSkeleton />}>
          <CalendarComponent
            appointments={appointments}
            patients={patients}
            currentUserId={session?.user.id}
          />
        </Suspense>
      </div>
    </main>
  );
}
