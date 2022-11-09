FROM node

WORKDIR /app/socket

COPY package.json .

RUN npm install -g npm@8.19.3

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm", "run", "dev"]