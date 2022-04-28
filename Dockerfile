FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./prisma ./prisma/

RUN yarn install 

COPY . .

FROM node:lts-alpine 

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/nx.json ./nx.json
COPY --from=builder /app/.env ./
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json

RUN yarn build:all

EXPOSE 3333 4200

CMD [ "yarn", "run", "start:all" ]
