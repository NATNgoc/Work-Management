FROM node:20.11.1-alpine3.19 as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# FROM base
# COPY dist . 
CMD [ "npm", "run", "start:prod" ]