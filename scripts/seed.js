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

      // Split name into first and last names
      const [firstName, lastName] = patient.name.split(" ");

      // Insert user and get the inserted ID
      const userInsertResult = await client.sql`
        INSERT INTO "User" (
          name,
          username,
          email,
          password,
          role
        )
        VALUES (
          ${patient.name}, 
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
          "lastName"
        )
        VALUES (
          ${userId},
          ${firstName},
          ${lastName}
        );
      `;
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
