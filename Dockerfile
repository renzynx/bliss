FROM node:lts-alpine

WORKDIR /opt/bliss

COPY package.json .

RUN npm install

COPY . .
COPY .env .env

RUN npm run build \
    && npm run migrate

ENV NODE_ENV production

EXPOSE 42069

CMD ["npm", "start"]

USER node