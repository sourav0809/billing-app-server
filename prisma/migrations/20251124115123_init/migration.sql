-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "address" TEXT,
    "role" TEXT NOT NULL,
    "parentUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryItems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Billings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sellerId" TEXT,
    "billingDate" TIMESTAMP(3) NOT NULL,
    "billingType" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Billings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillingItems" (
    "id" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "inventoryId" TEXT,
    "channelId" TEXT,
    "planId" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "BillingItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillingHistories" (
    "id" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingHistories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'DPO',
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanChannels" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "PlanChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPlans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "UserPlans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserChannels" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "addedFrom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserChannelHistories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChannelHistories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlanChannels_planId_channelId_key" ON "public"."PlanChannels"("planId", "channelId");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Billings" ADD CONSTRAINT "Billings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Billings" ADD CONSTRAINT "Billings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingItems" ADD CONSTRAINT "BillingItems_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."Billings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingItems" ADD CONSTRAINT "BillingItems_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."InventoryItems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingItems" ADD CONSTRAINT "BillingItems_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."Channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingItems" ADD CONSTRAINT "BillingItems_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingHistories" ADD CONSTRAINT "BillingHistories_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."Billings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanChannels" ADD CONSTRAINT "PlanChannels_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanChannels" ADD CONSTRAINT "PlanChannels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPlans" ADD CONSTRAINT "UserPlans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPlans" ADD CONSTRAINT "UserPlans_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserChannels" ADD CONSTRAINT "UserChannels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserChannels" ADD CONSTRAINT "UserChannels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserChannelHistories" ADD CONSTRAINT "UserChannelHistories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserChannelHistories" ADD CONSTRAINT "UserChannelHistories_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
