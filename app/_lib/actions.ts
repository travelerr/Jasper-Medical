"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { auth } from "../../auth";
import {
  ActionResponse,
  CreateAllergenInputs,
  CreateAppointmentInputs,
  CreateCognitiveStatusInputs,
  CreateDietInputs,
  CreateDrugIntoleranceInputs,
  CreateExerciseInputs,
  CreateFamilyHistoryInputs,
  CreateFunctionalStatusInputs,
  CreateHabitInputs,
  CreatePastMedicalHistoryInputs,
  CreatePastSurgicalHistoryInputs,
  CreatePatientInputs,
  CreateProblemInputs,
  CreatePsychologicalStatusInputs,
  CreateSocialHistoryInputs,
  DeleteCognitiveStatusInputs,
  DeleteDietInputs,
  DeleteExerciseInputs,
  DeleteFamilyHistoryInputs,
  DeleteFunctionalStatusInputs,
  DeleteHabitInputs,
  DeletePastMedicalHistoryInputs,
  DeletePastSurgicalHistoryInputs,
  DeletePsychologicalStatusInputs,
  DeleteSocialHistoryInputs,
  EditAllergenInputs,
  EditCognitiveStatusInputs,
  EditDietInputs,
  EditDrugIntoleranceInputs,
  EditExerciseInputs,
  EditFamilyHistoryInputs,
  EditFunctionalStatusInputs,
  EditHabitInputs,
  EditHabitSmokingStatusInputs,
  EditPastMedicalHistoryInputs,
  EditPastSurgicalHistoryInputs,
  EditProblemInputs,
  EditPsychologicalStatusInputs,
  EditPsychologicalStatusStressLevelInputs,
  EditSocialHistoryEducationLevelInputs,
  EditSocialHistoryFinancialStrainInputs,
  EditSocialHistoryInputs,
  JWTDuration,
  State,
  SurveySubmission,
  UpdateFamilyRelativeInputs,
} from "./definitions";
import prisma from "./prisma";
import { AppointmentStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { generatePasswordResetToken, generateRandomPassword } from "./utils";
import { sendEmailTemplate } from "./email-provider";
import jwt from "jsonwebtoken";

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

// #region System Setting & Testing

export async function sendTestEmail(formData: { testEmail: string }) {
  try {
    const token = generatePasswordResetToken(1, JWTDuration.FullHour);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    await sendEmailTemplate({
      to: formData.testEmail,
      subject: "Welcome to Jasper Medical!",
      template: "Testing",
      templateData: {
        testUrl: `${baseUrl}/authentication/create-password/?token=${token}`,
        testReplacement: `${baseUrl}/authentication/create-password/?token=${token}`,
      },
    });
    console.log("Email sent");
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}

// #endregion

// #region Auth

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // @ts-ignore
    return { userId: decoded.userId, valid: true };
  } catch (error) {
    console.error(error);
    return { valid: false };
  }
};

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

export async function userSignOut() {
  try {
    await signOut();
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialsSignin";
    }
    throw error;
  }
}

export async function createUserAndPatient(
  formData: CreatePatientInputs
): Promise<ActionResponse> {
  const {
    email,
    firstName,
    middleName,
    lastName,
    suffix,
    dob,
    sexAtBirth,
    gender,
    genderMarker,
    race,
    pronouns,
    ethnicity,
    contact,
    sendEmail,
  } = formData;

  const hashedPassword = await bcrypt.hash(generateRandomPassword(), 10);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // First, create the User record
      const user = await prisma.user.create({
        data: {
          email: email,
          username: email, // Assuming the email is used as username
          password: hashedPassword,
          role: "PATIENT", // Assuming role is set to 'PATIENT' by default
        },
      });
      // Then, create the Patient record linked to the newly created User
      const patient = await prisma.patient.create({
        data: {
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          suffix: suffix,
          dob: new Date(dob),
          sexAtBirth: sexAtBirth,
          gender: gender,
          genderMarker: genderMarker,
          race: race,
          pronouns: pronouns,
          ethnicity: ethnicity,
          contact: {
            create: {
              primaryPhone: contact.primaryPhone,
              primaryPhoneType: contact.primaryPhoneType,
              secondaryPhoneType: contact.secondaryPhoneType,
              street: contact.street,
              apt: contact.apt,
              city: contact.city,
              zip: contact.zip,
              pharmacy: contact.pharmacy,
              secondaryPharmacy: contact.secondaryPharmacy,
              secondaryStreet: contact.secondaryStreet,
              secondaryApt: contact.secondaryApt,
              secondaryCity: contact.secondaryCity,
              secondaryState: contact.secondaryState,
              secondaryZip: contact.secondaryZip,
              ecFirstName: contact.ecFirstName,
              ecLastName: contact.ecLastName,
              ecRelationship: contact.ecRelationship,
              ecPhone: contact.ecPhone,
              ecStreet: contact.ecStreet,
              ecApt: contact.ecApt,
              ecCity: contact.ecCity,
              ecState: contact.ecState,
              ecZip: contact.ecZip,
            },
          },
          userId: user.id,
        },
      });
      // Then, send portal invite email if chosen
      if (sendEmail) {
        const token = generatePasswordResetToken(
          user?.id,
          JWTDuration.ThirtyDays
        );
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        try {
          await sendEmailTemplate({
            to: email,
            subject: "Welcome to Jasper Medical",
            template: "NewPatientRegPortalLogin",
            templateData: {
              url: `${baseUrl}/authentication/create-password/?token=${token}`,
            },
          });
        } catch (error: any) {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
          // TODO: Consider how to handle email send failure, perhaps with a user-friendly message
        }
      }
      return { user, patient };
    });
    return {
      message: "User and Patient created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create user and patient.",
      actionSuceeded: false,
    };
  }
}

export async function updateUserPasswordWithJWT(formData: {
  password: string;
  token: string;
}): Promise<ActionResponse> {
  const hashedPassword = await bcrypt.hash(formData.password, 10);
  const decoded = verifyToken(formData.token);
  if (decoded.valid === false) {
    return {
      message: "Password creation failes.",
      actionSuceeded: false,
    };
  }
  try {
    const result = await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      message: "Password updated successfully.",
      actionSuceeded: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update password.",
      actionSuceeded: false,
    };
  }
}

export async function sendResetPasswordEmailWithJWT(formData: {
  email: string;
}): Promise<ActionResponse> {
  try {
    const result = await prisma.user.findUnique({
      where: {
        email: formData.email,
      },
      select: {
        id: true, // Only select the id field
      },
    });
    if (result) {
      const token = generatePasswordResetToken(
        result?.id,
        JWTDuration.QuarterHour
      );
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        await sendEmailTemplate({
          to: formData.email,
          subject: "Jasper Medical - Password Reset",
          template: "ResetPasswordEmail",
          templateData: {
            url: `${baseUrl}/authentication/reset-password/?token=${token}`,
          },
        });
      } catch (error: any) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    } else {
      // If no user is found
      return {
        message: "User not found.",
        actionSuceeded: false,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to find user.",
      actionSuceeded: false,
    };
  }
}

// #endregion

// #region Appointments

export async function createAppointment(
  formData: CreateAppointmentInputs
): Promise<ActionResponse> {
  const { title, patient, startDate, endDate, startTime, endTime, details } =
    formData;
  const session = await auth();
  try {
    const result = await prisma.appointment.create({
      data: {
        startTime: new Date(startDate + " " + startTime),
        endTime: new Date(endDate + " " + endTime),
        title: title,
        details: details,
        doctorId: Number(session?.user.id),
        patientId: parseInt(patient),
        status: AppointmentStatus.Scheduled,
      },
    });
    return {
      message: "Appointment created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create appointment.",
      actionSuceeded: false,
    };
  }
}

export async function updateAppointment(
  appointmentId: number,
  formData: CreateAppointmentInputs
): Promise<ActionResponse> {
  const { title, patient, startDate, endDate, startTime, endTime, details } =
    formData;
  const session = await auth();
  try {
    const result = await prisma.appointment.update({
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
        status: AppointmentStatus.Scheduled,
      },
    });
    return {
      message: "Appointment updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update appointment.",
      actionSuceeded: false,
    };
  }
}

export async function deleteAppointmentByID(
  id: number
): Promise<ActionResponse> {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      return prisma.appointment.delete({
        where: {
          id: id,
        },
      });
    });
    return {
      message: "Appointment deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete appointment.",
      actionSuceeded: false,
    };
  }
}

// #endregion

// #region Allergy

export async function createAllergy(
  formData: CreateAllergenInputs
): Promise<ActionResponse> {
  const { name, reaction, severity, status, onsetDate, patientId } = formData;
  try {
    const result = await prisma.allergy.create({
      data: {
        name: name,
        reaction: reaction,
        severity: severity,
        status: status,
        onsetDate: new Date(onsetDate),
        patientId: patientId,
      },
    });
    return {
      message: "Allergy created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create allergy.",
      actionSuceeded: false,
    };
  }
}

export async function updateAllergy(
  formData: EditAllergenInputs
): Promise<ActionResponse> {
  const { name, reaction, severity, status, onsetDate, allergyId } = formData;
  try {
    const result = await prisma.allergy.update({
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
    return {
      message: "Allergy updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update allergy.",
      actionSuceeded: false,
    };
  }
}

export async function deleteAllergyByID(id: number): Promise<ActionResponse> {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      return prisma.allergy.delete({
        where: {
          id: id,
        },
      });
    });
    return {
      message: "Allergy deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete allergy.",
      actionSuceeded: false,
    };
  }
}

// #endregion

// #region Drug Intolerances

export async function createDrugIntolerance(
  formData: CreateDrugIntoleranceInputs
): Promise<ActionResponse> {
  const { name, reaction, severity, status, onsetDate, patientId, drugId } =
    formData;
  try {
    const result = await prisma.drugIntolerance.create({
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
    return {
      message: "Drug Intolerance created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create drug intolerance.",
      actionSuceeded: false,
    };
  }
}

export async function updateDrugIntolerance(
  formData: EditDrugIntoleranceInputs
): Promise<ActionResponse> {
  const { reaction, severity, status, onsetDate, id, drug } = formData;
  try {
    const result = await prisma.drugIntolerance.update({
      where: {
        id: id,
      },
      data: {
        drugId: drug.id,
        reaction: reaction,
        severity: severity,
        status: status,
        onsetDate: new Date(onsetDate),
      },
    });
    return {
      message: "Drug Intolerance updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update drug intolerance.",
      actionSuceeded: false,
    };
  }
}

export async function deleteDrugIntoleranceByID(
  id: number
): Promise<ActionResponse> {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      return prisma.drugIntolerance.delete({
        where: {
          id: id,
        },
      });
    });
    return {
      message: "Drug Intolerance deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete drug Intolerance.",
      actionSuceeded: false,
    };
  }
}

// #endregion

// #region Problem List

export async function createProblem(
  formData: CreateProblemInputs
): Promise<ActionResponse> {
  const { synopsis, dxDate, status, patientId, name, icd10Codes } = formData;
  try {
    const result = await prisma.problemList.create({
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
    return {
      message: "Patient problem created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient problem",
      actionSuceeded: false,
    };
  }
}

export async function updateProblem(
  formData: EditProblemInputs
): Promise<ActionResponse> {
  const { id, dxDate, status, synopsis, icd10Codes, name } = formData;
  try {
    const result = await prisma.problemList.update({
      where: {
        id: id,
      },
      data: {
        icd10Codes: {
          create: icd10Codes
            // @ts-ignore
            .filter((code) => code.isNew)
            .map((code) => ({
              icd10CodeId: code.id,
            })),
        },
        name: name,
        synopsis: synopsis,
        status: status,
        dxDate: new Date(dxDate),
      },
    });
    return {
      message: "Patient problem updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient problem.",
      actionSuceeded: false,
    };
  }
}

export async function deleteProblemListByID(
  id: number
): Promise<ActionResponse> {
  try {
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
    return {
      message: "Patient problem list deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient problem list.",
      actionSuceeded: false,
    };
  }
}

export async function deleteProblemListICD10CodeByID(
  id: number
): Promise<ActionResponse> {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      await prisma.problemListICD10Code.deleteMany({
        where: {
          id: id,
        },
      });
    });
    return {
      message: "Problem list ICD10 code deleted successfully",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database Error: Failed to delete patient problem list ICD10 code.",
      actionSuceeded: false,
    };
  }
}

// #endregion

// #region History

export async function createPastMedicalHistory(
  formData: CreatePastMedicalHistoryInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.pastMedicalHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient past medical history created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient past medical history",
      actionSuceeded: false,
    };
  }
}

export async function editPastMedicalHistory(
  formData: EditPastMedicalHistoryInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.pastMedicalHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient past medical history updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient past medical history",
      actionSuceeded: false,
    };
  }
}

export async function deletePastMedicalHistory(
  formData: DeletePastMedicalHistoryInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.pastMedicalHistory.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient past medical history deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient past medical history",
      actionSuceeded: false,
    };
  }
}

export async function createPastSurgicalHistory(
  formData: CreatePastSurgicalHistoryInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.pastSurgicalHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient past Surgical history created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient past surgical history",
      actionSuceeded: false,
    };
  }
}

export async function editPastSurgicalHistory(
  formData: EditPastSurgicalHistoryInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.pastSurgicalHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient past Surgical history updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient past surgical history",
      actionSuceeded: false,
    };
  }
}

export async function deletePastSurgicalHistory(
  formData: DeletePastSurgicalHistoryInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.pastSurgicalHistory.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient past Surgical history deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient past surgical history",
      actionSuceeded: false,
    };
  }
}

export async function createFamilyHistory(
  formData: CreateFamilyHistoryInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.familyHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient family history created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient family history",
      actionSuceeded: false,
    };
  }
}

export async function editFamilyHistory(
  formData: EditFamilyHistoryInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.familyHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient family history updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient family history",
      actionSuceeded: false,
    };
  }
}

export async function deleteFamilyHistory(
  formData: DeleteFamilyHistoryInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.familyHistory.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient family history deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient family history",
      actionSuceeded: false,
    };
  }
}

export async function updateFamilyRelative(
  formData: UpdateFamilyRelativeInputs
): Promise<ActionResponse> {
  const { id, relative, value } = formData;
  let dto = {};
  switch (relative) {
    case "mother":
      dto = { familyHistoryMother: value };
      break;
    case "father":
      dto = { familyHistoryFather: value };
      break;
    case "brother":
      dto = { familyHistoryBrother: value };
      break;
    case "sister":
      dto = { familyHistorySister: value };
      break;
    case "son":
      dto = { familyHistorySon: value };
      break;
    case "daughter":
      dto = { familyHistoryDaughter: value };
      break;
    case "grandmother":
      dto = { familyHistoryGrandmother: value };
      break;
    case "grandfather":
      dto = { familyHistoryGrandfather: value };
      break;
    case "aunt":
      dto = { familyHistoryAunt: value };
      break;
    case "uncle":
      dto = { familyHistoryUncle: value };
      break;
    case "other":
      dto = { familyHistoryOther: value };
      break;
    default:
      console.error("error in switch statement");
  }
  try {
    const result = await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: dto,
    });
    return {
      message: "Patient past Surgical history updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient past surgical history",
      actionSuceeded: false,
    };
  }
}

export async function createCognitiveStatus(
  formData: CreateCognitiveStatusInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.cognitiveStatus.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient cognitive status created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient cognitive status",
      actionSuceeded: false,
    };
  }
}

export async function editCognitiveStatus(
  formData: EditCognitiveStatusInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.cognitiveStatus.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient cognitive status updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient cognitive status",
      actionSuceeded: false,
    };
  }
}

export async function deleteCognitiveStatus(
  formData: DeleteCognitiveStatusInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.cognitiveStatus.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient cognitive status deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient cognitive status",
      actionSuceeded: true,
    };
  }
}

export async function createFunctionalStatus(
  formData: CreateFunctionalStatusInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.functionalStatus.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient functional status created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient functional status",
      actionSuceeded: false,
    };
  }
}

export async function editFunctionalStatus(
  formData: EditFunctionalStatusInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.functionalStatus.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient functional status updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient functional status",
      actionSuceeded: false,
    };
  }
}

export async function deleteFunctionalStatus(
  formData: DeleteFunctionalStatusInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.functionalStatus.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient functional status deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient functional status",
      actionSuceeded: false,
    };
  }
}

export async function createPsychologicalStatus(
  formData: CreatePsychologicalStatusInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.psychologicalStatus.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient psychological status created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient psychological status",
      actionSuceeded: false,
    };
  }
}

export async function editPsychologicalStatus(
  formData: EditPsychologicalStatusInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.psychologicalStatus.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient psychological status updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient psychological status",
      actionSuceeded: false,
    };
  }
}

export async function editPsychologicalStatusStressLevel(
  formData: EditPsychologicalStatusStressLevelInputs
): Promise<ActionResponse> {
  const { value, id } = formData;
  try {
    const result = await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        psychologicalStatusStress: value,
      },
    });
    return {
      message: "Patient stress level updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient stress level",
      actionSuceeded: false,
    };
  }
}

export async function deletePsychologicalStatus(
  formData: DeletePsychologicalStatusInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.psychologicalStatus.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient psychological status deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient psychological status",
      actionSuceeded: false,
    };
  }
}

export async function createHabit(
  formData: CreateHabitInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.habits.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient habit created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient habit",
      actionSuceeded: false,
    };
  }
}

export async function editHabit(
  formData: EditHabitInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.habits.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient habit updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient habit",
      actionSuceeded: false,
    };
  }
}

export async function editHabitSmokingStatus(
  formData: EditHabitSmokingStatusInputs
): Promise<ActionResponse> {
  const { value, id } = formData;
  try {
    const result = await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        habitsSmokingStatus: value,
      },
    });
    return {
      message: "Patient smoking status updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient smoking status",
      actionSuceeded: false,
    };
  }
}

export async function deleteHabit(
  formData: DeleteHabitInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.habits.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient habit deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient habit",
      actionSuceeded: false,
    };
  }
}

export async function createDiet(
  formData: CreateDietInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.diet.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient diet created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient diet",
      actionSuceeded: false,
    };
  }
}

export async function editDiet(
  formData: EditDietInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.diet.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient diet updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient diet",
      actionSuceeded: false,
    };
  }
}

export async function deleteDiet(
  formData: DeleteDietInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.diet.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient diet deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient diet",
      actionSuceeded: false,
    };
  }
}

export async function createExercise(
  formData: CreateExerciseInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.exercise.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient exercise created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient exercise",
      actionSuceeded: false,
    };
  }
}

export async function editExercise(
  formData: EditExerciseInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.exercise.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient exercise updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient exercise",
      actionSuceeded: false,
    };
  }
}

export async function deleteExercise(
  formData: DeleteExerciseInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.exercise.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient exercise deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient exercise",
      actionSuceeded: false,
    };
  }
}

export async function createSocialHistory(
  formData: CreateSocialHistoryInputs
): Promise<ActionResponse> {
  const { note, patientHistoryId } = formData;
  try {
    const result = await prisma.socialHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });
    return {
      message: "Patient social history created successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient social history",
      actionSuceeded: false,
    };
  }
}

export async function editSocialHistory(
  formData: EditSocialHistoryInputs
): Promise<ActionResponse> {
  const { note, id } = formData;
  try {
    const result = await prisma.socialHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });
    return {
      message: "Patient social history updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient social history",
      actionSuceeded: false,
    };
  }
}

export async function editSocialHistoryFinancialStrain(
  formData: EditSocialHistoryFinancialStrainInputs
): Promise<ActionResponse> {
  const { value, id } = formData;
  try {
    const result = await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        socialHistoryFinancialStrain: value,
      },
    });
    return {
      message: "Patient social history education level updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database Error: Failed to update patient social history education level",
      actionSuceeded: false,
    };
  }
}

export async function editSocialHistoryEducationLevel(
  formData: EditSocialHistoryEducationLevelInputs
): Promise<ActionResponse> {
  const { value, id } = formData;
  try {
    const result = await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        socialHistoryEducation: value,
      },
    });
    return {
      message: "Patient social history financial strain updated successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database Error: Failed to update patient social history financial strain",
      actionSuceeded: false,
    };
  }
}

export async function deleteSocialHistory(
  formData: DeleteSocialHistoryInputs
): Promise<ActionResponse> {
  const { id } = formData;
  try {
    const result = await prisma.socialHistory.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Patient social history deleted successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient social history",
      actionSuceeded: false,
    };
  }
}

// #endregion

// #region Survey
export async function submitSurvey(
  formData: SurveySubmission
): Promise<ActionResponse> {
  try {
    for (const item of formData.responsesArr) {
      // Check if a record exists with the same surveyId, patientHistoryId, and questionId
      const existingRecord = await prisma.surveyResponse.findFirst({
        where: {
          surveyId: item.surveyId,
          patientHistoryId: item.patientHistoryId,
          questionId: item.questionId,
        },
      });

      if (existingRecord) {
        // If the record exists, update it
        await prisma.surveyResponse.update({
          where: { id: existingRecord.id },
          data: {
            responseBool: item.responseBool,
            responseInt: item.responseInt,
            responseText: item.responseText,
          },
        });
      } else {
        // If the record does not exist, create a new one
        await prisma.surveyResponse.create({
          data: item,
        });
      }
    }

    const existingRecord = await prisma.surveyScore.findFirst({
      where: {
        surveyId: formData.surveyId,
        patientHistoryId: formData.patientHistoryId,
      },
    });

    let result;
    if (existingRecord) {
      // If the record exists, update it
      result = await prisma.surveyScore.update({
        where: { id: existingRecord.id },
        data: {
          score: formData.score,
        },
      });
    } else {
      // If the record does not exist, create a new one
      result = await prisma.surveyScore.create({
        data: {
          surveyId: formData.surveyId,
          patientHistoryId: formData.patientHistoryId,
          score: formData.score,
          surveyName: formData.surveyName,
        },
      });
    }
    return {
      message: "Survey responses processed successfully.",
      actionSuceeded: true,
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to process survey responses.",
      actionSuceeded: false,
    };
  }
}
// #endregion
