---
name: database-backup
description: "Back up and restore PostgreSQL for PTE Talents using pg_dump, WAL archiving, S3/R2/MinIO offsite storage, and Docker Compose scheduling. Use when designing backup strategy, automating daily dumps, testing restores, or planning disaster recovery for a Prisma + PostgreSQL stack."
argument-hint: "[strategy|restore]"
model: sonnet
allowed-tools:
  - read
  - grep
  - exec
  - web_search
  - web_get_contents
triggers:
  - user
  - model
---

# Database Backup & Restore (PostgreSQL + Prisma)

> **Quick Guide:** A backup you haven't restored is a wish. For PTE Talents: run `pg_dump` daily to S3/R2/MinIO, keep WAL archives for point-in-time recovery, test restores monthly, store Prisma migrations separately, and never keep backups unencrypted. Use Docker Compose or a BullMQ worker for scheduling.

---

<critical_requirements>

## CRITICAL: Before Using This Skill

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST encrypt backups at rest using AES-256 or server-side S3 encryption before leaving the server)**

**(You MUST store backups offsite — on a different provider/region from the live database)**

**(You MUST test restore procedures at least monthly and verify data integrity)**

**(You MUST separate Prisma migration files from backups — migrations are code, backups are data)**

**(You MUST monitor backup jobs and alert on failure; silent backup failures are worse than no backups)**

**(You MUST NEVER commit database credentials or backup encryption passphrases to version control)**

</critical_requirements>

---

**Auto-detection:** PostgreSQL backup, pg_dump, pg_basebackup, WAL archive, point-in-time recovery, Prisma backup, Docker Compose backup, S3 backup, restore test, disaster recovery

**When to use:**

- Designing backup strategy for a PostgreSQL-backed PTE platform
- Automating daily/hourly logical backups
- Setting up point-in-time recovery with WAL archiving
- Testing restore procedures or migrating data

**When NOT to use:**

- Database schema design (use `api-database-prisma` and `api-database-postgresql`)
- Real-time replication/high-availability setup (this skill covers backups, not streaming replication)
- Cloud-native managed DB automated backups (use the cloud provider's tooling and this skill for supplemental offsite dumps)

---

<philosophy>

## Philosophy

Backups are only real if they can be restored. The hierarchy of protection:

1. **Logical dumps (`pg_dump`)** — portable, per-database, easy to restore to a specific point, but can lose data since last dump.
2. **WAL archiving** — enables point-in-time recovery between dumps.
3. **Offsite encryption** — protects against server/disk/provider failures and ransomware.
4. **Restore testing** — proves the backups work and documents recovery time.

For PTE Talents, a daily encrypted `pg_dump` to object storage plus WAL archiving is the right balance of simplicity and recovery capability.

</philosophy>

---

<patterns>

## Core Patterns

### Pattern 1: Daily Encrypted pg_dump with Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pte_talents
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  backup:
    image: postgres:16-alpine
    environment:
      PGPASSWORD: ${DB_PASSWORD}
      AWS_ACCESS_KEY_ID: ${BACKUP_ACCESS_KEY}
      AWS_SECRET_ACCESS_KEY: ${BACKUP_SECRET_KEY}
      S3_BUCKET: ${BACKUP_BUCKET}
    command: >
      sh -c "
        apk add --no-cache aws-cli || true;
        pg_dump -h postgres -U postgres -Fc pte_talents > /tmp/pte_talents-$$(date +%Y%m%d-%H%M%S).dump
        openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:$$BACKUP_PASSPHRASE -in /tmp/*.dump -out /tmp/*.dump.enc
        aws s3 cp /tmp/*.dump.enc s3://$$S3_BUCKET/postgres/daily/ --storage-class STANDARD_IA
        rm /tmp/*.dump*
      "
    volumes:
      - backup-cache:/tmp
```

Schedule with `cron` inside a sidecar or a host-level systemd timer/BullMQ job.

**Why good:** `pg_dump -Fc` produces a compressed, single-file custom format that restores quickly. Encryption with `openssl` protects data in object storage.

---

### Pattern 2: WAL Archiving for Point-in-Time Recovery

Add to `postgresql.conf` (or a Postgres config mount):

```ini
wal_level = replica
archive_mode = on
archive_command = 'test -f /archives/%f || cp %p /archives/%f'
archive_timeout = 300
max_wal_senders = 3
```

Upload WAL files continuously to object storage:

```bash
#!/bin/bash
# archive_command using rclone/s3cmd
rclone copy "${1}" "s3:${BACKUP_BUCKET}/postgres/wal/"
```

**Why good:** WAL archiving allows recovery to any point between base backups, reducing RPO from "last daily dump" to "last WAL segment".

---

### Pattern 3: BullMQ Backup Worker

```typescript
import { Queue, Worker } from 'bullmq';
import { spawn } from 'node:child_process';

export const backupQueue = new Queue('db-backup', { connection: redisConnection });

export const backupWorker = new Worker(
  'db-backup',
  async () => {
    const fileName = `pte_talents-${new Date().toISOString()}.dump.enc`;
    const dump = spawn('pg_dump', ['-h', process.env.DB_HOST!, '-U', process.env.DB_USER!, '-Fc', process.env.DB_NAME!], { env: { PGPASSWORD: process.env.DB_PASSWORD! } });
    const encrypt = spawn('openssl', ['enc', '-aes-256-cbc', '-salt', '-pbkdf2', '-pass', `pass:${process.env.BACKUP_PASSPHRASE!}`]);

    dump.stdout.pipe(encrypt.stdin);
    // stream encrypt.stdout to S3
    await uploadStreamToS3(encrypt.stdout, process.env.BACKUP_BUCKET!, `postgres/daily/${fileName}`);
  },
  { connection: redisConnection, concurrency: 1 },
);
```

Schedule with `upsertJobScheduler` (see `api-queue-bullmq`) for daily execution.

**Why good:** Using BullMQ gives retry, observability, and integration with the existing queue infrastructure; streaming avoids disk I/O for large databases.

---

### Pattern 4: Restore and Verify Procedure

```bash
# 1. Download and decrypt
gpg --decrypt /backups/pte_talents-2026-07-21.dump.enc > /tmp/restore.dump

# 2. Create a clean target DB
createdb -U postgres pte_talents_restore_test

# 3. Restore
pg_restore -U postgres -d pte_talents_restore_test --no-owner --no-privileges /tmp/restore.dump

# 4. Run Prisma migrate status check
dotenv -e .env.restore -- npx prisma migrate status

# 5. Sanity count rows
psql -U postgres -d pte_talents_restore_test -c "SELECT count(*) FROM \"User\";"

# 6. Clean up
dropdb -U postgres pte_talents_restore_test
```

```typescript
// app/api/admin/backups/verify/route.ts
export async function POST() {
  const result = await runRestoreTest();
  return Response.json({ success: result.success, restoredAt: new Date(), details: result.log });
}
```

**Why good:** Monthly restore tests catch corrupted backups, missing extensions, and permission issues before an emergency.

---

### Pattern 5: Prisma Migration + Backup Coordination

Migrations are code in `prisma/migrations/`. Backups are data snapshots. Do not mix them.

```bash
# Deploy migrations before restoring a backup to a fresh environment
npx prisma migrate deploy

# Restore data
pg_restore -d pte_talents /tmp/backup.dump

# If restoring to a point before a migration, first restore to a DB with the matching migration baseline
npx prisma migrate resolve --applied 20250721000000_baseline
```

**Why good:** Restoring a backup to a schema version mismatch causes constraint errors. Always align migration baseline and backup point.

---

### Pattern 6: Backup Retention and Cost Control

```bash
# S3 lifecycle rule (store in repo docs or IaC)
{
  "Rules": [{
    "ID": "postgres-backups",
    "Status": "Enabled",
    "Filter": { "Prefix": "postgres/daily/" },
    "Transitions": [
      { "Days": 30, "StorageClass": "GLACIER" }
    ],
    "Expiration": { "Days": 365 }
  }]
}
```

For monthly verified restore snapshots, keep the most recent 12 on `STANDARD_IA` and move older to Glacier or delete.

**Why good:** Retention policies prevent unlimited storage growth and satisfy audit requirements.

</patterns>

---

<decision_framework>

## Decision Framework

### Which Backup Strategy

```
Small DB (< 100 GB), low write volume -> Daily pg_dump + weekly restore test
Need < 1 hour RPO -> WAL archiving + base backup every 6 hours
Very large DB or strict RTO -> pgBackRest/Barman incremental backups + replicas
Cloud managed DB (RDS/Cloud SQL) -> Enable provider backups + supplemental pg_dump to separate account
```

### When to Restore

```
Accidental data deletion     -> Point-in-time restore to just before deletion
Major corruption/ransomware  -> Restore last known-good base backup + WAL up to clean point
Environment refresh          -> Restore latest dump to staging
```

</decision_framework>

---

<red_flags>

## RED FLAGS

**High Priority Issues:**

- Backups stored only on the same server/volume as the live database
- Unencrypted backups in object storage
- No tested restore procedure
- Backup jobs failing silently without alerts
- Committing `DB_PASSWORD` or `BACKUP_PASSPHRASE` to git

**Medium Priority Issues:**

- No WAL archiving for write-heavy workloads
- Restoring a backup without matching migration baseline
- Keeping backups indefinitely without retention policy
- Not validating row counts after restore

**Common Mistakes:**

- Using `pg_dump` plain SQL format for large databases (custom `-Fc` is faster and smaller)
- Backing up `pgdata` files directly while Postgres is running (inconsistent)
- Forgetting `PGPASSWORD` so `pg_dump` prompts and hangs in automated jobs
- Storing the encryption passphrase in the same S3 bucket as the backup

</red_flags>

---

<critical_reminders>

## CRITICAL REMINDERS

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST encrypt backups at rest before leaving the server)**

**(You MUST store backups offsite)**

**(You MUST test restore procedures at least monthly and verify data integrity)**

**(You MUST separate Prisma migration files from backups)**

**(You MUST monitor backup jobs and alert on failure)**

**(You MUST NEVER commit database credentials or backup encryption passphrases to version control)**

**Failure to follow these rules will result in unrecoverable data loss during incidents.**

</critical_reminders>
