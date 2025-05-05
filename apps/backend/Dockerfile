FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat bash openssl && \
    corepack enable && \
    pnpm install turbo --global

WORKDIR /app

# Copiando arquivos para a imagem
COPY turbo.json .
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY apps/web/package.json apps/web/
COPY packages ./packages
COPY apps/backend ./apps/backend

# Instalando dependências
RUN pnpm install --prefer-offline

# Torna init.sh executável
RUN chmod +x apps/backend/init.sh && echo "✅ init.sh marcado como executável."

WORKDIR /app/apps/backend

EXPOSE 3000

CMD echo "🚀 Executando init.sh..." && bash ./init.sh
