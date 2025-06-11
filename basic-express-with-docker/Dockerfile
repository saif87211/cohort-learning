#base image
FROM node:24-alpine

#create app directory
WORKDIR /app

#copy files in to the app dir
COPY package*.json ./

#install all modules
RUN npm i

COPY prisma ./prisma

RUN npx prisma generate

#copy all source code
COPY . .

#best practice mark our image has service which listen on this port
EXPOSE 4000

#final command that is run when the users starts container
CMD npx prisma migrate deploy && npm run start
#it's basically apply migration and then starts app