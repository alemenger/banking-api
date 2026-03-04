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
  // 1) Encontrar el user
  const user = await prisma.user.findUnique({
    where: { email: "ale@test.com" },
  });
  if (!user) throw new Error("User not found");

  // 2) Tomar la primera cuenta del user
  const account = await prisma.account.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  if (!account) throw new Error("Account not found for user");

  const amount = 100; // depósito de 100 CAD

  // 3) Hacer depósito de forma atómica (DB transaction)
  const result = await prisma.$transaction(async (tx) => {
    const createdTx = await tx.transaction.create({
      data: {
        toAccountId: account.id,
        type: "DEPOSIT",
        amount, // Prisma lo guarda como Decimal
        memo: "Initial deposit",
      },
    });

    const updatedAccount = await tx.account.update({
      where: { id: account.id },
      data: { balance: { increment: amount } },
    });

    return { createdTx, updatedAccount };
  });

  console.log("DEPOSIT TX:", result.createdTx);
  console.log("UPDATED ACCOUNT:", result.updatedAccount);
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