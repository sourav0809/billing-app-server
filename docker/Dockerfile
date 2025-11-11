FROM node:alpine

RUN mkdir -p /usr/src/ && chown -R node:node /usr/src/

WORKDIR /usr/src/

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 8000