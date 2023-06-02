-- CreateTable
CREATE TABLE "HatcherAuthUser" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "info" JSONB NOT NULL DEFAULT '{}',
    "authIdentifier" TEXT NOT NULL,
    "authSecret" TEXT,
    "seenAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HatcherAuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HatcherAuthUserSession" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "originType" TEXT,
    "originHost" TEXT,
    "originAgent" TEXT,
    "seenAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HatcherAuthUserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HatcherAuthUser_authIdentifier_key" ON "HatcherAuthUser"("authIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "HatcherAuthUserSession_token_key" ON "HatcherAuthUserSession"("token");

-- AddForeignKey
ALTER TABLE "HatcherAuthUserSession" ADD CONSTRAINT "HatcherAuthUserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "HatcherAuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
