FROM node:16.16

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn --network-timeout 1000000000

COPY . .

RUN NODE_ENV=production yarn build:client

RUN yarn build

CMD ["yarn", "prod"]
