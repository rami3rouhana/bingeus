FROM node

WORKDIR /app/poll

COPY package.json .

RUN npm install -g npm@9.1.1

RUN npm install

COPY . .

EXPOSE ${POLL_PORT}

CMD ["npm", "start"]