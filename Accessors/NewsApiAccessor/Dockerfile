FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3003 for NewsApiAccessor
EXPOSE 3003

# Start NewsApiAccessor
CMD ["npm", "start"]
