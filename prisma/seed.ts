import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.deviceType.createMany({
    data: [
      {
        name: "Humidity Sensor",
      },
      {
        name: "Pressure Sensor",
      },
      {
        name: "Flow Sensor",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
