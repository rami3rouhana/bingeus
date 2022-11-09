FROM node

WORKDIR /app/user

COPY package.json .

RUN npm install -g npm@8.19.3

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]