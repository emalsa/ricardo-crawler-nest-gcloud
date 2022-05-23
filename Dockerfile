FROM node:erbium-alpine3.14

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start:prod" ]