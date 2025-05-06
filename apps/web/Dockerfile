FROM node:20-alpine AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# Copia só arquivos essenciais para resolver deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/*/package.json packages/*/

# Instala dependências
RUN pnpm install --prefer-offline

# -------------------------------------------------------------------

FROM node:20-alpine AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# Copia apenas arquivos de configuração e código fonte (sem node_modules!)
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY apps/web ./apps/web
COPY packages ./packages

# Cache local será externo via volume no compose
EXPOSE 3000

CMD ["pnpm", "dev"]
