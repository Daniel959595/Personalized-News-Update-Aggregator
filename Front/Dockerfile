FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3000 for Front
EXPOSE 3000

# Start Front
CMD ["npm", "start"]
