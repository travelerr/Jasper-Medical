const XLSX = require("xlsx");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importExcelData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  // Process data as needed to fit your Prisma model structure
  const processedData = data.map((item) => ({
    code: item.CODE,
    shortDescription: item.SHORTDESCRIPTION,
    longDescription: item.LONGDESCRIPTION,
    // Add other fields and processing as necessary
  }));

  return processedData;
}

async function seedDatabase(data) {
  for (const item of data) {
    await prisma.iCD10Code.create({
      data: item,
    });
  }
}

async function main() {
  const filePath =
    "/Users/justinsacco/Developer Projects/NextJSDemo/medical data/ICD10 Codes/icd10-codes.numbers";
  const data = await importExcelData(filePath);
  await seedDatabase(data);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
