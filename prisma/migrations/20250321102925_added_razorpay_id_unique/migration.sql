/*
  Warnings:

  - A unique constraint covering the columns `[razorpayId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpayId_key" ON "Subscription"("razorpayId");
