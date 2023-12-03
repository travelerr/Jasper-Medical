"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import prisma from "./prisma";
import { auth } from "../../auth";

function isStartBeforeEnd(
  startDateStr: string,
  startTimeStr: string,
  endDateStr: string,
  endTimeStr: string
) {
  // Combine date and time strings
  const startDateTimeStr = `${startDateStr}T${startTimeStr}`;
  const endDateTimeStr = `${endDateStr}T${endTimeStr}`;

  // Create Date objects
  const startDateTime = new Date(startDateTimeStr);
  const endDateTime = new Date(endDateTimeStr);

  // Check if the start date-time is before the end date-time
  return startDateTime < endDateTime;
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Please enter an amount greater than $0.",
  }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
const CreateAppointmentSchema = z
  .object({
    title: z.string({
      required_error: "Appointment title is required.",
    }),
    patient: z.string({
      required_error: "Please select a patient.",
    }),
    startDate: z.string({
      required_error: "Start date is required.",
    }),
    endDate: z.string({
      required_error: "End date is required.",
    }),
    startTime: z.string({
      required_error: "Start time is required.",
    }),
    endTime: z.string({
      required_error: "End time is required.",
    }),
    notes: z.string().optional(),
    details: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Ensure end date is after start date
    if (
      isStartBeforeEnd(
        data.startDate,
        data.startTime,
        data.endDate,
        data.endTime
      )
    ) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be after start date.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

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
    notes?: string[] | undefined;
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialsSignin";
    }
    throw error;
  }
}

export async function createAppointment(prevState: any, formData: FormData) {
  const validatedFields = CreateAppointmentSchema.safeParse({
    title: formData.get("title"),
    patient: formData.get("patient"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    notes: formData.get("notes"),
    details: formData.get("details"),
  });
  // Handle form validation errors or proceed with form data
  if (!validatedFields.success) {
    // Return validation errors
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Failed to create appointment.",
    };
  }

  // @TODO: add title and notes to db schema
  // Prepare data for insertion into the database
  const {
    title,
    patient,
    startDate,
    endDate,
    startTime,
    endTime,
    notes,
    details,
  } = validatedFields.data;
  const session = await auth();

  // Insert data into the database
  try {
    // Create a new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        startTime: new Date(startDate + " " + startTime),
        endTime: new Date(endDate + " " + endTime),
        description: title,
        status: "Scheduled",
      },
    });

    // Link the appointment to the current user and the patient
    await prisma.userAppointment.createMany({
      data: [
        { userId: Number(session?.user.id), appointmentId: newAppointment.id },
        { userId: parseInt(patient), appointmentId: newAppointment.id },
      ],
    });

    return { message: "Appointment created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create appointment.",
    };
  }
}
