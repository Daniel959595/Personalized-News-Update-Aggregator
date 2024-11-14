FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3002 for UsersManager
EXPOSE 3002

# Start UsersManager
CMD ["npm", "start"]
