FROM node:latest

WORKDIR /app

COPY package*.json ./

# Install inside container (important!)
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
