# Source tutorial
#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
#https://www.youtube.com/watch?v=CsWoMpK3EtE&t=134s

FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

#move the package files on the /usr/src/app which is in ./
COPY package*.json ./

# launch to download package
RUN npm install

# Copy all files in the root to the root of the docker image
COPY . .

# The container will comunicate to the 8080 port
EXPOSE 8080

# When launch will execute the cmd node_modules/.bin/nodemon src/index.js
CMD [ "node_modules/.bin/nodemon", "src/index.js" ]