FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache bash libc6-compat && corepack enable

WORKDIR /app

# Copia apenas os arquivos necessários para o runtime leve
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/backend/init.sh apps/backend/
COPY apps/backend ./apps/backend
COPY packages ./packages

WORKDIR /app/apps/backend

RUN chmod +x init.sh

EXPOSE 3000

CMD ["bash", "./init.sh"]
