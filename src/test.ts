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
  // 1) Buscar el usuario existente
  const user = await prisma.user.findUnique({
    where: { email: "ale@test.com" },
  });

  if (!user) {
    throw new Error("User not found. Run the user creation first.");
  }

  // 2) Crear cuenta para ese user (la relación es por userId)
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      currency: "CAD",
      balance: 0,
    },
  });

  console.log("ACCOUNT CREATED:", account);

  // 3) Ver todas las cuentas del usuario
  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
  });

  console.log("ALL ACCOUNTS FOR USER:", accounts);

}

main()
  .catch((e) => {
    console.error("ERROR:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("Done.");
  });