FROM node:lts-buster-slim AS builder
RUN apt-get update && apt-get install -y \
    build-essential \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY .yarn ./.yarn
COPY .yarnrc.yml ./.yarnrc.yml
COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

FROM node:lts-buster-slim AS runner
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/package.json ./package.json 
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./nest-cli.json
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json 
COPY .gitignore .gitignore

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]