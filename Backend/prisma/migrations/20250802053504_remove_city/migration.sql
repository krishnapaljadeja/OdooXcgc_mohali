-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('REPORTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ROADS', 'LIGHTING', 'WATER', 'CLEANLINESS', 'PUBLIC_SAFETY', 'OBSTRUCTIONS', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "liveLocation" TEXT,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER DEFAULT 0,
    "profilePic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isGoverment" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problems" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "location" TEXT NOT NULL,
    "clustorId" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'REPORTED',
    "image" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lang" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "rating" SMALLINT DEFAULT 0,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "category" "public"."Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics" (
    "id" SERIAL NOT NULL,
    "totalProblems" INTEGER NOT NULL DEFAULT 0,
    "solvedProblems" INTEGER NOT NULL DEFAULT 0,
    "inProgress" INTEGER NOT NULL DEFAULT 0,
    "rejected" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_problemId_key" ON "public"."Vote"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_problemId_key" ON "public"."Rating"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "public"."problems" ADD CONSTRAINT "problems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
