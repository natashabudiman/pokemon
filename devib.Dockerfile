FROM node:10-alpine as builder

LABEL name="Pokemon"
LABEL version="1.0.0"

RUN apk update && apk add --no-cache git

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json .

RUN yarn

COPY --chown=node:node ./src ./src
COPY --chown=node:node ./public ./public
COPY --chown=node:node ./jsconfig.json ./jsconfig.json

ENV NODE_ENV=development
ENV PUBLIC_URL=/
ENV REACT_APP_POKEAPI_URL=https://pokeapi.co/api/v2
ENV REACT_APP_LIMIT_PER_PAGE=30
ENV REACT_APP_WEB_TITLE="Pokemon"

RUN yarn build


FROM nginx:alpine

RUN apk update && apk add --no-cache git

COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443