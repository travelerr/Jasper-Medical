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
    ndc: item.ndc,
    type: item.type,
    proprietaryName: item.proprietaryName,
    proprietaryNameSuffix: item.proprietaryNameSuffix,
    nonProprietaryName: item.nonProprietaryName,
    dosageFormName: item.dosageFormName,
    routeName: item.routeName,
    manufacturerName: item.manufacturerName,
    substanceName: item.substanceName,
    activeNumeratorStrength: item.activeNumeratorStrength,
    activeIngredientUnit: item.activeIngredientUnit,
    pharmClasses: item.pharmClasses,
    deaSchedule: item.deaSchedule,
  }));

  return processedData;
}

async function seedDatabase(data) {
  for (const item of data) {
    await prisma.drug.create({
      data: item,
    });
  }
}

async function main() {
  const filePath =
    "/Users/justinsacco/Developer Projects/NextJSDemo/medical data/Drugs/drugs-table-formatted.numbers";
  const data = await importExcelData(filePath);
  await seedDatabase(data);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
