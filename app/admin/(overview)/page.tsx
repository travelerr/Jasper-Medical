import LatestInvoices from "@/app/_ui/dashboard/latest-invoices";
import { lusitana } from "@/app/_ui/fonts";
import { Suspense } from "react";
import CardWrapper from "@/app/_ui/dashboard/cards";
import {
  RevenueChartSkeleton,
  InvoiceSkeleton,
  CardsSkeleton,
} from "@/app/_ui/skeletons";
import { auth } from "../../../auth";
import Calendar from "@/app/_ui/doctor/calendar-component";

export default async function Page() {
  const session = await auth();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Admin Dashboard
      </h1>
    </main>
  );
}
