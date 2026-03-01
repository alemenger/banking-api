import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  async function main() {
  const created = await prisma.user.create({
    data: {
      email: "ale@test.com",
      fullName: "Alejandro Mendoza",
    },
  });

  console.log("CREATED:", created);

  const users = await prisma.user.findMany();
  console.log("ALL USERS:", users);
}