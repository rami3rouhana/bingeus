FROM node

WORKDIR /app/poll

COPY package.json .

RUN npm install -g npm@9.1.1

RUN npm install

COPY . .

EXPOSE 8004

CMD ["npm", "run", "dev"]