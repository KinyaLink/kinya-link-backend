-- CreateTable
CREATE TABLE "usages" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "callsMade" INTEGER NOT NULL DEFAULT 0,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usages" ADD CONSTRAINT "usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
