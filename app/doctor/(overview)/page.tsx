import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import DashboardSkeleton from "@/app/ui/skeletons";
import { auth } from "../../../auth";
import CalendarComponent from "@/app/ui/doctor/calendar-component";
import { getAppointmentsByUserID } from "@/app/lib/data";
import { formatAppointmentsForCalendar } from "@/app/lib/utils";

export default async function Page() {
  const session = await auth();
  let appointments = await getAppointmentsByUserID(Number(session?.user.id));
  appointments = formatAppointmentsForCalendar(appointments);
  return (
    <main>
      <div className="h-full">
        <Suspense fallback={<DashboardSkeleton />}>
          <CalendarComponent appointments={appointments} />
        </Suspense>
      </div>
    </main>
  );
}
