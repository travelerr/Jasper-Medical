const { db } = require("@vercel/postgres");
const { patients } = require("./placeholder-data.js");
const bcrypt = require("bcrypt");

// @TODO: Seed dev users
async function seedDevUsers(client) {}

async function seedPatients(client) {
  try {
    const insertedPatients = [];

    for (const patient of patients) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(patient.password, 10);

      // Insert user and get the inserted ID
      const userInsertResult = await client.sql`
        INSERT INTO "User" (
          username,
          email,
          password,
          role
        )
        VALUES (
          ${patient.username}, 
          ${patient.email},
          ${hashedPassword},
          'PATIENT'
        )
        RETURNING id;
      `;
      const userId = userInsertResult.rows[0].id;

      // Insert patient profile linked to user
      const patientProfileResult = await client.sql`
        INSERT INTO "Patient" (
          "userId",
          "firstName",
          "middleName",
          "lastName"
        )
        VALUES (
          ${userId},
          ${patient.firstName},
          ${patient.middleName},
          ${patient.lastName}
        )
        RETURNING id;;
      `;
      const patientId = patientProfileResult.rows[0].id;

      // Seed Contact data
      await seedContactData(client, patientId);

      // Seed Insurance data
      await seedInsuranceData(client, patientId);

      // Seed Consult data
      await seedConsultData(client, patientId, 3); // 3 consult records

      // Seed TestResult data
      await seedTestResultData(client, patientId, 3); // 3 test result records

      // Seed Provider data
      await seedProviderData(client, patientId);

      // Seed Alergy data
      await seedAllergyData(client, patientId);

      // Seed ProblemList data
      await seedProblemListData(client, patientId);

      insertedPatients.push(patientProfileResult);
    }

    console.log(`Seeded ${insertedPatients.length} patients`);

    return {
      insertedPatients,
    };
  } catch (error) {
    console.error("Error seeding patients:", error);
    throw error;
  }
}

async function seedContactData(client, patientId) {
  // Example: Insert Contact data for a patient
  await client.sql`
    INSERT INTO "Contact" (
      "primaryPhone", 
      "primaryPhoneType", 
      "street", 
      "city", 
      "state", 
      "zip", 
      "patientId"
    )
    VALUES (
      '123-456-7890', 
      'MOBILE', 
      '123 Main St', 
      'Anytown', 
      'NY', 
      '12345', 
      ${patientId}
    );
  `;
}

async function seedInsuranceData(client, patientId) {
  // Example: Insert Insurance data for a patient
  await client.sql`
    INSERT INTO "Insurance" (
      "insuanceName", 
      "planName", 
      "groupId", 
      "memberId", 
      "effectiveDate", 
      "patientId"
    )
    VALUES (
      'Test Insurance', 
      'Standard Plan', 
      'GRP123', 
      'MBR456', 
      '2023-01-01', 
      ${patientId}
    );
  `;
}

async function seedConsultData(client, patientId, count) {
  for (let i = 0; i < count; i++) {
    // Insert Consult data for a patient
    const note = `Consultation notes ${i + 1}`;
    await client.sql`
      INSERT INTO "Consult" (
        "date", 
        "notes", 
        "patientId"
      )
      VALUES (
        ${new Date().toISOString()}, 
        ${note}, 
        ${patientId}
      );
    `;
  }
}

async function seedTestResultData(client, patientId, count) {
  for (let i = 0; i < count; i++) {
    // Insert TestResult data for a patient
    const testNote = `Test ${i + 1}`;
    const testNoteResult = `Test result notes ${i + 1}`;
    await client.sql`
      INSERT INTO "TestResult" (
        "date", 
        "name", 
        "notes", 
        "patientId"
      )
      VALUES (
        ${new Date().toISOString()}, 
        ${testNote}, 
        ${testNoteResult}, 
        ${patientId}
      );
    `;
  }
}

async function seedProviderData(client, patientId) {
  // Insert Provider data for a patient
  await client.sql`
    INSERT INTO "Provider" (
      "name", 
      "provider", 
      "pcp", 
      "state", 
      "patientId"
    )
    VALUES (
      'Primary Care Provider', 
      'Provider Group', 
      'Dr. Smith', 
      'NY', 
      ${patientId}
    );
  `;
}

async function seedAllergyData(client, patientId) {
  // Insert Allergy data for a patient
  const allergyInsertResult = await client.sql`
    INSERT INTO "Allergy" (
      "name", 
      "reaction", 
      "severity", 
      "status", 
      "onsetDate", 
      "patientId"
    )
    VALUES (
      'Pollen Allergy', 
      'Sneezing', 
      'Moderate', 
      'Active', 
      '2023-04-01', 
      ${patientId}
    )
    RETURNING id;
  `;
  const allergyId = allergyInsertResult.rows[0].id;

  // Seed Allergen data
  await seedAllergenData(client, allergyId);
}

async function seedAllergenData(client, allergyId) {
  // Insert Allergen data for an allergy
  await client.sql`
    INSERT INTO "Allergen" (
      "name", 
      "allergyId"
    )
    VALUES 
      ('Grass Pollen', ${allergyId}),
      ('Tree Pollen', ${allergyId});
  `;
}

async function seedProblemListData(client, patientId) {
  for (let i = 0; i < 3; i++) {
    // Insert ProblemList data for a patient
    const problem = `Problem ${i + 1}`;
    const synopsis = `Synopsis for problem ${i + 1}`;
    await client.sql`
      INSERT INTO "ProblemList" (
        "name", 
        "dxDate", 
        "status", 
        "synopsis", 
        "patientId"
      )
      VALUES (
        ${problem}, 
        ${new Date().toISOString()}, 
        'Active', 
        ${synopsis}, 
        ${patientId}
      );
    `;
  }
}

// @TODO: Seed doctors
async function seedDoctors(client) {}

// @TODO: Seed admins
async function seedAdmins(client) {}

async function main() {
  const client = await db.connect();
  const hashedTestPassword = await bcrypt.hash("password123", 10);
  console.log(hashedTestPassword);
  await seedPatients(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
