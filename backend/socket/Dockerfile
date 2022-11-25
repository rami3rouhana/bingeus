FROM node

WORKDIR /app/socket

COPY package.json .

RUN npm install -g npm@9.1.1

RUN npm install

COPY . .

EXPOSE ${SOCKET_PORT}

CMD ["npm", "start"]