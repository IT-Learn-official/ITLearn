import { prisma } from "../src/db/prisma";

async function main(): Promise<void> {
  console.log("No Prisma seed data configured.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
