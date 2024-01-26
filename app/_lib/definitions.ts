// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import {
  Allergy,
  AllergySeverity,
  AllergyStatus,
  Appointment,
  AppointmentStatus,
  Consult,
  Contact,
  Drug,
  DrugIntolerance,
  DrugIntoleranceSeverity,
  DrugIntoleranceStatus,
  Ethnicity,
  ICD10Code,
  Insurance,
  Patient,
  Prisma,
  ProblemList,
  ProblemListICD10Code,
  ProblemListStatus,
  Provider,
  Race,
  Sex,
  TestResult,
} from "@prisma/client";

// #region Auth

export enum UserRole {
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
  ADMIN = "ADMIN",
}

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

export type Role = {
  id: number;
  name: string;
};

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// #endregion

// #region Appointments

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
  createdDate: Date;
  updatedDate: Date;
  name: string | null;
  title: string;
  startTime: Date;
  endTime: Date;
  details: string;
  status: AppointmentStatus;
  doctorId: number;
  patientId: number;
  doctor: {
    firstName: string;
    lastName: string;
  };
  patient: {
    firstName: string;
    lastName: string;
  };
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

// #endregion

// #region Allergy

export type CreateAllergenInputs = {
  name: string;
  reaction: string;
  severity: AllergySeverity;
  status: AllergyStatus;
  onsetDate: string;
  patientId: number;
};

export type EditAllergenInputs = {
  name: string;
  reaction: string;
  severity: AllergySeverity;
  status: AllergyStatus;
  onsetDate: string;
  allergyId: number;
};

// #endregion

// #region Drug Intolerances

export type CreateDrugIntoleranceInputs = {
  name: string;
  reaction: string;
  severity: DrugIntoleranceSeverity;
  status: DrugIntoleranceStatus;
  onsetDate: string;
  patientId: number;
  drugId: number;
};

export type EditDrugIntoleranceInputs = {
  drug: Drug;
  reaction: string;
  severity: DrugIntoleranceSeverity;
  status: DrugIntoleranceStatus;
  onsetDate: string;
  id: number;
};

// #endregion

// #region Problem List

export type CreateProblemInputs = {
  name?: string;
  dxDate: string;
  status: ProblemListStatus;
  synopsis: string;
  patientId: number;
  icd10Codes: ProblemListICD10Code[];
};

export type EditProblemInputs = {
  id: number;
  name?: string;
  dxDate: string;
  status: ProblemListStatus;
  synopsis: string;
  patientId: number;
  icd10Codes: ICD10Code[];
};

// #endregion

// #region Patient

export type FullPatientProfile = Patient & {
  race: Race;
  sexAtBirth: Sex;
  ethnicity: Ethnicity;
  contact: Contact;
  insurance: Insurance;
  provider: Provider;
  allergy: Allergy[];
  drugIntolerance: (DrugIntolerance & { drug: Drug })[];
  problemList: (ProblemList & {
    icd10Codes: (ProblemListICD10Code & { icd10Code: ICD10Code })[];
  })[];
  appointments: Appointment[];
  consults: Consult[];
  testResults: TestResult[];
};

export type PatientNextAndLastApt = {
  lastApt: Appointment;
  nextApt: Appointment;
};

// #endregion

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
