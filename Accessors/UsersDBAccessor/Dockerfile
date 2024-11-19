FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3005 for usersDBAccessor
EXPOSE 3005

# Start usersDBAccessor
CMD ["npm", "start"]
