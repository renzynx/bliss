FROM node:lts-buster-slim AS builder
RUN apt update

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile 

COPY . .

RUN yarn prisma generate

RUN yarn build

FROM node:lts-buster-slim AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./package.json 
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./nest-cli.json
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json 
COPY --from=builder /app/.env.production ./.env
COPY .gitignore .gitignore

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]