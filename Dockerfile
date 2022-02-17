FROM node:16.10

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

RUN NODE_ENV=production yarn build:client

RUN yarn build

CMD ["yarn", "prod"]
