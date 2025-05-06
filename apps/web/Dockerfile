FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY . .

WORKDIR /app/apps/web
RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "dev"]
