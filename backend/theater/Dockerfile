FROM node

WORKDIR /app/theater

COPY package.json .

RUN npm install -g npm@9.1.1

RUN npm install

COPY . .

EXPOSE ${THEATER_PORT}

CMD ["npm", "start"]