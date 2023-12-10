import { User } from "@prisma/client";
import {
  GetAppointmentsByUserID,
  Revenue,
  UserAppointmentWithAppointment,
  UserWithRole,
} from "./definitions";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const checkUserForRole = (roles: Array<UserWithRole>, role: string) => {
  if (roles.some((x: UserWithRole) => x.role.name === role)) return true;
  return false;
};

// Formater for Big Calendar
export const formatAppointmentsForCalendar = (
  appointments: Array<GetAppointmentsByUserID>
): Array<any> => {
  const formattedAppointments = appointments?.map((item) => ({
    id: item.id,
    users: item.users.map((userAppointment) => ({
      ...userAppointment,
      user: {
        ...userAppointment.user,
        height: Number(userAppointment.user.height), // Convert height to number
        weight: Number(userAppointment.user.weight),
      },
    })),
    start: new Date(item.startTime),
    end: new Date(item.endTime),
    title: item.title,
    details: item.details,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    cancelledAt: item.cancelledAt,
  }));
  return formattedAppointments as any;
};

// Formater for Big Calendar
export const formatPatientsForCalendar = (
  patients: Array<User>
): Array<any> => {
  const formattedPatients = patients?.map((item) => ({
    ...item,
    weight: JSON.parse(JSON.stringify(item.weight)),
    height: JSON.parse(JSON.stringify(item.height)),
  }));
  return formattedPatients;
};

export const isStartBeforeEnd = (
  startDateStr: string,
  startTimeStr: string,
  endDateStr: string,
  endTimeStr: string
) => {
  // Combine date and time strings
  const combinedStartDateTime = `${startDateStr} ${startTimeStr}`;
  const combinedEndDateTime = `${endDateStr} ${endTimeStr}`;

  // Create Date objects
  const startDateTime = new Date(combinedStartDateTime);
  const endDateTime = new Date(combinedEndDateTime);

  // Check if the start date-time is before the end date-time
  return startDateTime < endDateTime;
};
