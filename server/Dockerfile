FROM node:18-alpine as server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npx prisma generate 

EXPOSE 8080

CMD ["npm", "run", "start:dev"]
