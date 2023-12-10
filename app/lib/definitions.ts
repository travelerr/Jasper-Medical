// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import { Appointment, Prisma } from "@prisma/client";

export type Role = {
  id: number;
  name: string;
};

export type UserWithRole = {
  userId: number;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
};

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CreateAppointmentState = {
  errors: {
    details?: string[] | undefined;
    title?: string[] | undefined;
    startTime?: string[] | undefined;
    endTime?: string[] | undefined;
    patient?: string[] | undefined;
    startDate?: string[] | undefined;
    endDate?: string[] | undefined;
  };
  message?: string | null;
};

export type UserAppointmentWithAppointment = {
  appointmentId: number;
  userId: number;
  appointment: Appointment;
};

export type CreateAppointmentInputs = {
  title: string;
  patient: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  details: string;
};

export type EditAppointment = {
  id: number;
  userId: number;
  start: string;
  end: string;
  title: string;
  details: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: null | string;
  sourceResource: any;
  users: UserAppointment[];
};

export type UserAppointment = {
  appointmentId: number;
  userId: number;
  user: User;
};

export type GetAppointmentsByUserID = {
  id: number;
  startTime: Date;
  endTime: Date;
  title: string;
  status: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
  users: UserAppointment[];
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phoneNumber: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  height: Prisma.Decimal;
  weight: Prisma.Decimal;
  image: string | null;
};

/*****************/
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};
