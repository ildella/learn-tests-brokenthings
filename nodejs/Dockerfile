FROM node:alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ADD src/server.js ./

ADD package.json ./

RUN npm install

CMD ["npm", "start"]