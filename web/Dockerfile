FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable 


FROM node:18-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN NEXT_PUBLIC_API_URL=APP_NEXT_PUBLIC_API_URL yarn build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD [ "npm", "start" ]