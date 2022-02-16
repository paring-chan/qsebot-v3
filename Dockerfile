FROM node:16.10

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN yarn

RUN NODE_ENV=production yarn build:client

RUN yarn build

CMD ["yarn", "prod"]
