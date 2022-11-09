FROM node

WORKDIR /app/theater

COPY package.json .

RUN npm install -g npm@8.19.3

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "run", "dev"]