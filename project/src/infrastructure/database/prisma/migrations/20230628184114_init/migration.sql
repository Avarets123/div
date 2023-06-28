-- CreateEnum
CREATE TYPE "RequestStatusEnum" AS ENUM ('Active', 'Resolved');

-- CreateTable
CREATE TABLE "Request" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "RequestStatusEnum" NOT NULL DEFAULT 'Active',
    "comment" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
