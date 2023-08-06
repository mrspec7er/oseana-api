import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "info@oseanasnorkelingadventure.com" },
    update: {},
    create: {
      email: "info@oseanasnorkelingadventure.com",
      name: "Admin",
      password: "$2b$11$CrxWjPARlJ1R8t5KD0jhie1QVJ5S4fxuDXfhqDVm2r02vQ2xqeBoG",
      phone: "082339033660",
      verifiedEmail: true,
      role: "ADMIN",
    },
  });

  console.log("Seeder injected: ", admin.email);
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
