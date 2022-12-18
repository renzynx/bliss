FROM node:lts-buster-slim AS deps
RUN apt-get update && apt-get install --no-install-recommends -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --pure-lockfile

FROM node:lts-buster-slim AS builder
RUN apt-get update && apt-get install --no-install-recommends -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules 
COPY src ./src 
COPY prisma ./prisma
COPY .yarn .yarn 
COPY package.json yarn.lock .yarnrc.yml tsconfig.json tsconfig.build.json nest-cli.json ./

RUN yarn prisma generate
RUN yarn build

FROM node:lts-buster-slim AS runner
RUN apt-get update && apt-get install --no-install-recommends -y \
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

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]