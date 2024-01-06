import { Patient } from "@prisma/client";
import { GetAppointmentsByUserID, Revenue } from "./definitions";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatDateString = (dateStr: string, locale: string = "en-US") => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatPatientName = (patient: Patient): string => {
  return `${patient.firstName ?? ""}  ${patient.lastName ?? ""} `;
};

export const formatPatientDob = (dob: Date): string => {
  // Parse the date string
  const parsedDate = new Date(dob);

  // Format the date as M/D/YYYY
  const formattedDate = `${
    parsedDate.getMonth() + 1
  }/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;

  // Calculate age
  const now = new Date();
  let years = now.getFullYear() - parsedDate.getFullYear();
  let months = now.getMonth() - parsedDate.getMonth();
  if (now.getDate() < parsedDate.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Return the formatted date string with age
  return `${formattedDate} (${years} yrs ${months} mos)`;
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

// Formater for Big Calendar
export const formatAppointmentsForCalendar = (
  appointments: Array<GetAppointmentsByUserID>
): Array<any> => {
  const formattedAppointments = appointments?.map((item) => ({
    ...item,
    start: new Date(item.startTime),
    end: new Date(item.endTime),
  }));
  return formattedAppointments as any;
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

export const formatTimeString = (timestamp: number) => {
  const date = new Date(timestamp);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two-digit minutes
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours || 12; // Convert '0' hour to '12'

  return `${hours}:${minutes} ${ampm}`;
};
