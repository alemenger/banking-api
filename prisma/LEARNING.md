# Banking System Project - Learning Notes

## Architecture

TypeScript → Prisma → PostgreSQL → Database

PostgreSQL = source of truth

Prisma = translator between code and database

## Why Decimal instead of Float

Float is approximate → causes rounding errors

Decimal is exact → required for money

Example:
0.1 + 0.2 = 0.30000000000000004 (float)

Decimal avoids this.

## Relationships

User → Account = one-to-many

One user can have many accounts
Each account belongs to one user

## Prisma Role

Prisma translates models into SQL tables

model Account → CREATE TABLE Account

Prisma does not store data
PostgreSQL stores data