# 🧪 Take Home – Projeto Fullstack com Monorepo

Este projeto é uma aplicação fullstack organizada em **monorepo** com **Turborepo**, utilizando **Next.js 15** no frontend e **NestJS + Prisma** no backend. A arquitetura segue o modelo **feature-based**, com foco em **manutenibilidade**, **escalabilidade** e **produtividade**, preparada para ambientes com **Docker** e com ótima experiência de desenvolvimento local.

---
## 💡 Visão Geral da Arquitetura

![Desenho da arquitetura](./arquitetura.png)

Este diagrama mostra um resumo dos componentes do projeto


## 🚀 Tecnologias Utilizadas

### Frontend (`apps/web`)
- [Next.js 15 (App Router)](https://nextjs.org/docs/app/building-your-application/routing)
- [React 19](https://react.dev/)
- [TanStack React Query v5](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org/)
- Testes com [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/)

### Backend (`apps/backend`)
- [NestJS 11](https://docs.nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Redis](https://redis.io/) para caching
- Banco de dados PostgreSQL via Docker
- Testes: unitários, integração e e2e com Jest

---

## 📁 Estrutura do Projeto

```txt
apps/
  backend/         ← API REST com NestJS, Prisma, Redis
  web/             ← Aplicação Next.js com React Query e SSR
packages/
  ui/              ← Componentes reutilizáveis (design system)
  eslint-config/   ← Configurações compartilhadas de ESLint
  typescript-config/ ← Configuração base de TypeScript
```

> A estrutura adota o padrão **feature-based**, onde cada domínio possui sua própria pasta com componentes, serviços e testes.
> Exemplo: `users/components/UserForm.tsx`, `users/components/UserForm.test.tsx`, etc.

---

## 💡 Decisões de Arquitetura

- **Monorepo com Turborepo**: unifica o desenvolvimento de frontend, backend e pacotes compartilhados. Proporciona caching inteligente e execução paralela, acelerando builds e testes.
- **Feature-based architecture**: melhora a coesão e separação de responsabilidades por domínio, facilitando escalar, testar e manter.
- **Docker + Docker Compose**: garante ambientes consistentes para desenvolvimento, testes e produção.
- **Geração de tipos Prisma dentro e fora do Docker**:
  - Dentro do Docker: necessário para execução do backend.
  - Fora do Docker: melhora a experiência com tipagem no VSCode.

Essa estrutura torna o projeto altamente manutenível e escalável, promovendo produtividade com ambientes padronizados e automatizados.

---

## 🛠️ Pré-requisitos

- [Docker + Docker Compose](https://docs.docker.com/compose/install/)
- [PNPM](https://pnpm.io/) instalado globalmente
- Node.js (v18 ou superior)

---

## 🌐 Variáveis de Ambiente

Antes de qualquer comando, configure as variáveis de ambiente:

```bash
cp .env.example .env
cp apps/backend/.env.local.example apps/backend/.env.local
cp apps/web/.env.local.example apps/web/.env.local
```

### apps/backend/.env.local
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=secret-example
```

### apps/web/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### .env (raiz do projeto)
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app
DATABASE_URL=postgres://postgres:postgres@postgres:5432/app

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=secret-example
```

---

## ⚙️ Como rodar o projeto

### 1. Clonar o projeto
```bash
git clone https://github.com/roxdavirox/take-home.git
cd take-home
```

### 2. Instalar as dependências do monorepo
```bash
pnpm install
```

### 3. Subir toda a infraestrutura (Banco + Redis + Backend + Frontend)
```bash
docker-compose up -d
```
> Isso irá iniciar:
> - Banco de dados PostgreSQL
> - Redis
> - Backend (porta `3001`)
> - Frontend (porta `3000`)

### 4. Acessar a aplicação
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (API): [http://localhost:3001/users](http://localhost:3001/users)

### 5. Gerar tipos Prisma localmente para o VSCode
```bash
pnpm --filter backend prisma:generate:local
```
> Apenas necessário fora do Docker para que o VSCode reconheça os tipos corretamente.

---

## ✅ Rodando os testes

### Backend
```bash
pnpm --filter backend test         # Testes unitários e integração
pnpm --filter backend test:e2e     # Testes end-to-end (requer Docker rodando)
```

### Frontend
```bash
pnpm --filter web test             # Testes com saída detalhada
pnpm --filter web test:coverage    # Testes com relatório de cobertura
```

---

## ✨ Destaques do Projeto

- Organização baseada em **features/domínios** para clareza e manutenção
- Projeto estruturado em **monorepo** com **Turborepo** para ganho de performance e consistência entre frontend/backend
- **SSR com React Query** (`dehydrate/hydrate`) para melhor experiência de usuário
- Tipagem forte com Prisma, funcional no runtime (Docker) e no desenvolvimento (local)
- Integração com Redis para caching eficiente
- Testes cobrindo backend, frontend e integrações
- Ambiente totalmente orquestrado com Docker Compose para simular produção

---

## 📌 Considerações Finais

Este projeto foi pensado para proporcionar:

- **Manutenibilidade**: com arquitetura modular e escalável por domínio (feature-based)
- **Produtividade**: tipagem forte com Prisma + tooling local + testes bem definidos
- **Escalabilidade**: estrutura preparada para múltiplas aplicações no monorepo com compartilhamento de pacotes reutilizáveis (como `ui`, `eslint-config`, etc)
- **Ambientes previsíveis**: Docker + Docker Compose garantem que todos tenham o mesmo setup

A escolha do **Turborepo** se deu pela capacidade de cache inteligente entre tarefas (como testes, builds e lints), além da simplicidade de orquestrar projetos separados como `web`, `backend` e `packages`. Toda a estrutura está voltada a facilitar a evolução contínua com testes, consistência e performance.

