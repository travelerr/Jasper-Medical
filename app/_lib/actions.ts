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
  State,
  SurveySubmission,
  UpdateFamilyRelativeInputs,
} from "./definitions";
import prisma from "./prisma";
import { AppointmentStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateRandomPassword } from "./utils";

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

export async function createUserAndPatient(formData: CreatePatientInputs) {
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

      return { user, patient };
    });

    return { message: "User and Patient created successfully.", result };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create user and patient.",
    };
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
        status: AppointmentStatus.Scheduled,
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
        status: AppointmentStatus.Scheduled,
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
  const { reaction, severity, status, onsetDate, id, drug } = formData;
  try {
    await prisma.drugIntolerance.update({
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
        icd10Codes: {
          create: icd10Codes
            // @ts-ignore
            .filter((code) => code.isNew) // Filter to include only codes where isNew is true
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

export async function deleteProblemListICD10CodeByID(id: number) {
  const result = await prisma.$transaction(async (prisma) => {
    await prisma.problemListICD10Code.deleteMany({
      where: {
        id: id,
      },
    });
  });
  return result;
}

// #endregion

// #region History

export async function createPastMedicalHistory(
  formData: CreatePastMedicalHistoryInputs
) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.pastMedicalHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient past medical history created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient past medical history",
    };
  }
}

export async function editPastMedicalHistory(
  formData: EditPastMedicalHistoryInputs
) {
  const { note, id } = formData;
  try {
    await prisma.pastMedicalHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient past medical history updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient past medical history",
    };
  }
}

export async function deletePastMedicalHistory(
  formData: DeletePastMedicalHistoryInputs
) {
  const { id } = formData;
  try {
    await prisma.pastMedicalHistory.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient past medical history deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient past medical history",
    };
  }
}

export async function createPastSurgicalHistory(
  formData: CreatePastSurgicalHistoryInputs
) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.pastSurgicalHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient past Surgical history created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient past Surgical history",
    };
  }
}

export async function editPastSurgicalHistory(
  formData: EditPastSurgicalHistoryInputs
) {
  const { note, id } = formData;
  try {
    await prisma.pastSurgicalHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient past Surgical history updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient past Surgical history",
    };
  }
}

export async function deletePastSurgicalHistory(
  formData: DeletePastSurgicalHistoryInputs
) {
  const { id } = formData;
  try {
    await prisma.pastSurgicalHistory.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient past Surgical history deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient past Surgical history",
    };
  }
}

export async function createFamilyHistory(formData: CreateFamilyHistoryInputs) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.familyHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient family history created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient family history",
    };
  }
}

export async function editFamilyHistory(formData: EditFamilyHistoryInputs) {
  const { note, id } = formData;
  try {
    await prisma.familyHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient family history updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient family history",
    };
  }
}

export async function deleteFamilyHistory(formData: DeleteFamilyHistoryInputs) {
  const { id } = formData;
  try {
    await prisma.familyHistory.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient family history deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient family history",
    };
  }
}

export async function updateFamilyRelative(
  formData: UpdateFamilyRelativeInputs
) {
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
      console.log("error in switch statement");
  }

  try {
    await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: dto,
    });

    return { message: "Patient past Surgical history updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient past Surgical history",
    };
  }
}

export async function createCognitiveStatus(
  formData: CreateCognitiveStatusInputs
) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.cognitiveStatus.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient cognitive status created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient cognitive status",
    };
  }
}

export async function editCognitiveStatus(formData: EditCognitiveStatusInputs) {
  const { note, id } = formData;
  try {
    await prisma.cognitiveStatus.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient cognitive status updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient cognitive status",
    };
  }
}

export async function deleteCognitiveStatus(
  formData: DeleteCognitiveStatusInputs
) {
  const { id } = formData;
  try {
    await prisma.cognitiveStatus.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient cognitive status deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient cognitive status",
    };
  }
}

export async function createFunctionalStatus(
  formData: CreateFunctionalStatusInputs
) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.functionalStatus.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient functional status created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient functional status",
    };
  }
}

export async function editFunctionalStatus(
  formData: EditFunctionalStatusInputs
) {
  const { note, id } = formData;
  try {
    await prisma.functionalStatus.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient functional status updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient functional status",
    };
  }
}

export async function deleteFunctionalStatus(
  formData: DeleteFunctionalStatusInputs
) {
  const { id } = formData;
  try {
    await prisma.functionalStatus.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient functional status deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient functional status",
    };
  }
}

export async function createPsychologicalStatus(
  formData: CreatePsychologicalStatusInputs
) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.psychologicalStatus.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient psychological status created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient psychological status",
    };
  }
}

export async function editPsychologicalStatus(
  formData: EditPsychologicalStatusInputs
) {
  const { note, id } = formData;
  try {
    await prisma.psychologicalStatus.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient psychological status updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient psychological status",
    };
  }
}

export async function editPsychologicalStatusStressLevel(
  formData: EditPsychologicalStatusStressLevelInputs
) {
  const { value, id } = formData;
  try {
    await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        psychologicalStatusStress: value,
      },
    });

    return {
      message: "Patient stress level updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient stress level",
    };
  }
}

export async function deletePsychologicalStatus(
  formData: DeletePsychologicalStatusInputs
) {
  const { id } = formData;
  try {
    await prisma.psychologicalStatus.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient psychological status deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient psychological status",
    };
  }
}

export async function createHabit(formData: CreateHabitInputs) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.habits.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient habit created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient habit",
    };
  }
}

export async function editHabit(formData: EditHabitInputs) {
  const { note, id } = formData;
  try {
    await prisma.habits.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient habit updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient habit",
    };
  }
}

export async function editHabitSmokingStatus(
  formData: EditHabitSmokingStatusInputs
) {
  const { value, id } = formData;
  try {
    await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        habitsSmokingStatus: value,
      },
    });

    return {
      message: "Patient smoking status updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient smoking status",
    };
  }
}

export async function deleteHabit(formData: DeleteHabitInputs) {
  const { id } = formData;
  try {
    await prisma.habits.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient habit deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient habit",
    };
  }
}

export async function createDiet(formData: CreateDietInputs) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.diet.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient diet created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient diet",
    };
  }
}

export async function editDiet(formData: EditDietInputs) {
  const { note, id } = formData;
  try {
    await prisma.diet.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient diet updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient diet",
    };
  }
}

export async function deleteDiet(formData: DeleteDietInputs) {
  const { id } = formData;
  try {
    await prisma.diet.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient diet deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient diet",
    };
  }
}

export async function createExercise(formData: CreateExerciseInputs) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.exercise.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient exercise created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient exercise",
    };
  }
}

export async function editExercise(formData: EditExerciseInputs) {
  const { note, id } = formData;
  try {
    await prisma.exercise.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient exercise updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient exercise",
    };
  }
}

export async function deleteExercise(formData: DeleteExerciseInputs) {
  const { id } = formData;
  try {
    await prisma.exercise.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient exercise deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient exercise",
    };
  }
}

export async function createSocialHistory(formData: CreateSocialHistoryInputs) {
  const { note, patientHistoryId } = formData;
  try {
    await prisma.socialHistory.create({
      data: {
        note: note,
        patientHistoryId: patientHistoryId,
      },
    });

    return { message: "Patient social history created successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create patient social history",
    };
  }
}

export async function editSocialHistory(formData: EditSocialHistoryInputs) {
  const { note, id } = formData;
  try {
    await prisma.socialHistory.update({
      where: {
        id: id,
      },
      data: {
        note: note,
      },
    });

    return { message: "Patient social history updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to update patient social history",
    };
  }
}

export async function editSocialHistoryFinancialStrain(
  formData: EditSocialHistoryFinancialStrainInputs
) {
  const { value, id } = formData;
  try {
    await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        socialHistoryFinancialStrain: value,
      },
    });

    return {
      message: "Patient social history education level updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database Error: Failed to update patient social history education level",
    };
  }
}

export async function editSocialHistoryEducationLevel(
  formData: EditSocialHistoryEducationLevelInputs
) {
  const { value, id } = formData;
  try {
    await prisma.patientHistory.update({
      where: {
        id: id,
      },
      data: {
        socialHistoryEducation: value,
      },
    });

    return {
      message: "Patient social history financial strain updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database Error: Failed to update patient social history financial strain",
    };
  }
}

export async function deleteSocialHistory(formData: DeleteSocialHistoryInputs) {
  const { id } = formData;
  try {
    await prisma.socialHistory.delete({
      where: {
        id: id,
      },
    });

    return { message: "Patient social history deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete patient social history",
    };
  }
}

// #endregion

// #region Survey
export async function submitSurvey(formData: SurveySubmission) {
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

    if (existingRecord) {
      // If the record exists, update it
      await prisma.surveyScore.update({
        where: { id: existingRecord.id },
        data: {
          score: formData.score,
        },
      });
    } else {
      // If the record does not exist, create a new one
      await prisma.surveyScore.create({
        data: {
          surveyId: formData.surveyId,
          patientHistoryId: formData.patientHistoryId,
          score: formData.score,
          surveyName: formData.surveyName,
        },
      });
    }

    return { message: "Survey responses processed successfully." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to process survey responses.",
    };
  }
}
// #endregion
