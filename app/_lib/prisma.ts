// @ts-nocheck
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export type DoctorWithAppointment = Prisma.DoctorGetPayload<{
  include: { appointments: true };
}>;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
