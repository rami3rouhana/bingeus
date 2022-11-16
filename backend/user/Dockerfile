FROM node

WORKDIR /app/user

COPY package.json .

RUN npm install -g npm@9.1.1

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]