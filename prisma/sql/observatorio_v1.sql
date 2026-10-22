-- NeuroTwin 2050 — Observatório: migração incremental PostgreSQL.
-- Não modifica tabelas de autenticação Company/User.
-- Executar no banco de produção somente após confirmar que DATABASE_URL aponta para PostgreSQL.
CREATE TABLE IF NOT EXISTS "ObservatorySnapshot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL,
  "totalEvents" INTEGER NOT NULL,
  "sourcesJson" TEXT NOT NULL,
  "summaryJson" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "ObservatorySnapshot_createdAt_idx"
  ON "ObservatorySnapshot"("createdAt");

CREATE TABLE IF NOT EXISTS "ObservatoryEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "source" TEXT NOT NULL,
  "sourceEventId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "eventType" TEXT,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "magnitude" DOUBLE PRECISION,
  "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastReportedAt" TIMESTAMP(3),
  "state" TEXT NOT NULL DEFAULT 'observed'
);
CREATE UNIQUE INDEX IF NOT EXISTS "ObservatoryEvent_source_sourceEventId_key"
  ON "ObservatoryEvent"("source", "sourceEventId");
CREATE INDEX IF NOT EXISTS "ObservatoryEvent_lastSeenAt_idx"
  ON "ObservatoryEvent"("lastSeenAt");

CREATE TABLE IF NOT EXISTS "ObservatoryChange" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "eventId" TEXT NOT NULL,
  "changeType" TEXT NOT NULL,
  "detailsJson" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "ObservatoryChange_createdAt_idx"
  ON "ObservatoryChange"("createdAt");
CREATE INDEX IF NOT EXISTS "ObservatoryChange_eventId_idx"
  ON "ObservatoryChange"("eventId");
