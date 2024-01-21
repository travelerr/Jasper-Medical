"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { auth } from "../../auth";
import {
  CreateAllergenInputs,
  CreateAppointmentInputs,
  CreateDrugIntoleranceInputs,
  CreateProblemInputs,
  EditAllergenInputs,
  EditDrugIntoleranceInputs,
  EditProblemInputs,
  State,
} from "./definitions";
import prisma from "./prisma";
import { AppointmentStatus } from "@prisma/client";

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

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

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
      // @ts-ignore
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
      // @ts-ignore
      errors: validatedFields?.error.flatten().fieldErrors,
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

// #region Auth

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

// #endregion

// #region Appointments

export async function createAppointment(formData: CreateAppointmentInputs) {
  const { title, patient, startDate, endDate, startTime, endTime, details } =
    formData;
  const session = await auth();
  try {
    await prisma.appointment.create({
      data: {
        startTime: new Date(startDate + " " + startTime),
        endTime: new Date(endDate + " " + endTime),
        title: title,
        details: details,
        doctorId: Number(session?.user.id),
        patientId: parseInt(patient),
        status: AppointmentStatus.SCHEDULED,
      },
    });

    return { message: "Appointment created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create appointment.",
    };
  }
}

export async function updateAppointment(
  appointmentId: number,
  formData: CreateAppointmentInputs
) {
  const { title, patient, startDate, endDate, startTime, endTime, details } =
    formData;
  const session = await auth();
  try {
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        startTime: new Date(startDate + " " + startTime),
        endTime: new Date(endDate + " " + endTime),
        title: title,
        details: details,
        doctorId: Number(session?.user.id),
        patientId: parseInt(patient),
        status: AppointmentStatus.SCHEDULED,
      },
    });
    return { message: "Appointment updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update appointment.",
    };
  }
}

export async function deleteAppointmentByID(id: number) {
  const result = await prisma.$transaction(async (prisma) => {
    return prisma.appointment.delete({
      where: {
        id: id,
      },
    });
  });
  return result;
}

// #endregion

// #region Allergy

export async function createAllergy(formData: CreateAllergenInputs) {
  const { name, reaction, severity, status, onsetDate, patientId } = formData;
  try {
    await prisma.allergy.create({
      data: {
        name: name,
        reaction: reaction,
        severity: severity,
        status: status,
        onsetDate: new Date(onsetDate),
        patientId: patientId,
      },
    });

    return { message: "Allergy created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create allergy.",
    };
  }
}

export async function updateAllergy(formData: EditAllergenInputs) {
  const { name, reaction, severity, status, onsetDate, allergyId } = formData;
  try {
    await prisma.allergy.update({
      where: {
        id: allergyId,
      },
      data: {
        name: name,
        reaction: reaction,
        severity: severity,
        status: status,
        onsetDate: new Date(onsetDate),
      },
    });

    return { message: "Allergy updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update allergy.",
    };
  }
}

export async function deleteAllergyByID(id: number) {
  const result = await prisma.$transaction(async (prisma) => {
    return prisma.allergy.delete({
      where: {
        id: id,
      },
    });
  });
  return result;
}

// #endregion

// #region Drug Intolerances

export async function createDrugIntolerance(
  formData: CreateDrugIntoleranceInputs
) {
  const { name, reaction, severity, status, onsetDate, patientId, drugId } =
    formData;
  try {
    await prisma.drugIntolerance.create({
      data: {
        name: name,
        reaction: reaction,
        severity: severity,
        status: status,
        onsetDate: new Date(onsetDate),
        patientId: patientId,
        drugId: drugId,
      },
    });

    return { message: "Drug Intolerance created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create Drug Intolerance.",
    };
  }
}

export async function updateDrugIntolerance(
  formData: EditDrugIntoleranceInputs
) {
  const { reaction, severity, status, onsetDate, drugIntoleranceId } = formData;
  try {
    await prisma.drugIntolerance.update({
      where: {
        id: drugIntoleranceId,
      },
      data: {
        reaction: reaction,
        severity: severity,
        status: status,
        onsetDate: new Date(onsetDate),
        id: drugIntoleranceId,
      },
    });

    return { message: "Drug Intolerance updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update Drug Intolerance.",
    };
  }
}

export async function deleteDrugIntoleranceByID(id: number) {
  const result = await prisma.$transaction(async (prisma) => {
    return prisma.drugIntolerance.delete({
      where: {
        id: id,
      },
    });
  });
  return result;
}

// #endregion

// #region Problem List

export async function createProblem(formData: CreateProblemInputs) {
  const { synopsis, dxDate, status, patientId, name, icd10Codes } = formData;
  try {
    await prisma.problemList.create({
      data: {
        name: name,
        synopsis: synopsis,
        status: status,
        dxDate: new Date(dxDate),
        patientId: patientId,
        icd10Codes: {
          create: icd10Codes.map((code) => ({
            icd10CodeId: code.icd10CodeId,
          })),
        },
      },
    });

    return { message: "Patient problem created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient problem",
    };
  }
}

export async function updateProblem(formData: EditProblemInputs) {
  const { id, dxDate, status, synopsis, icd10Codes, name } = formData;
  try {
    await prisma.problemList.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        synopsis: synopsis,
        status: status,
        dxDate: new Date(dxDate),
      },
    });

    return { message: "Patient problem updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient problem.",
    };
  }
}

export async function deleteProblemListByID(id: number) {
  const result = await prisma.$transaction(async (prisma) => {
    await prisma.problemListICD10Code.deleteMany({
      where: {
        problemListId: id,
      },
    });

    return prisma.problemList.delete({
      where: {
        id: id,
      },
    });
  });
  return result;
}

// #endregion
