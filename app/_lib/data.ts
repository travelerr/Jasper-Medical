"use server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { CustomerField, InvoiceForm, InvoicesTable } from "./definitions";
import prisma from "./prisma";
import { DoctorWithAppointment } from "./prisma";
import type { Patient, User } from "@prisma/client";

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    return user as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getAppointmentsByUserID(
  userId: number
): Promise<DoctorWithAppointment> {
  try {
    const appointmentArray = await prisma.appointment.findMany({
      where: {
        doctorId: userId,
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return appointmentArray;
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    throw new Error("Failed to fetch appointments.");
  }
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const patients = await prisma.patient.findMany({});
    return patients;
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    throw new Error("Failed to fetch patients.");
  }
}

export async function getFullPatientProfileById(id: number): Promise<Patient> {
  try {
    const patientProfile = await prisma.patient.findUnique({
      where: { id: id },
      include: {
        contact: true,
        insurance: true,
        provider: true,
        allergy: true,
        problemList: true,
        appointments: true,
        consults: true,
        testResults: true,
      },
    });
    return patientProfile as Patient;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getPatientsTypeAhead(
  searchValue?: string
): Promise<Patient[]> {
  try {
    let query = {};

    if (searchValue) {
      const searchValueLower = searchValue.toLowerCase();
      query = {
        where: {
          OR: [
            {
              firstName: {
                contains: searchValueLower,
                mode: "insensitive", // for case-insensitive search
              },
            },
            {
              lastName: {
                contains: searchValueLower,
                mode: "insensitive", // for case-insensitive search
              },
            },
          ],
        },
      };
    }

    const patients = await prisma.patient.findMany(query);
    return patients;
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    throw new Error("Failed to fetch patients.");
  }
}