-- CreateTable
CREATE TABLE "HatcherTchatChannel" (
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "HatcherTchatChannel_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "HatcherTchatMessage" (
    "id" SERIAL NOT NULL,
    "channelSlug" TEXT,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HatcherTchatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HatcherTchatMessage" ADD CONSTRAINT "HatcherTchatMessage_channelSlug_fkey" FOREIGN KEY ("channelSlug") REFERENCES "HatcherTchatChannel"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
