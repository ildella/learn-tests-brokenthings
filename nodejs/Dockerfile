
# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

# ADD src/server.js ./

# ADD package.json ./

# RUN npm install

# CMD ["npm", "start"]

FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3456
CMD ["npm", "run", "server"]