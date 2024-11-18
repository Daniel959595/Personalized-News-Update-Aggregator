FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3001 for UsersManager
EXPOSE 3001

# Start UsersManager
CMD ["npm", "start"]
