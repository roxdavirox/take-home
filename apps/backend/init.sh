#!/bin/bash
pnpm install
pnpm --filter backend prisma:migrate:docker
pnpm --filter backend prisma:generate:docker
pnpm --filter backend prisma:seed
pnpm --filter backend start:dev
