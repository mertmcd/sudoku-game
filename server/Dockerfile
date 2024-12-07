# Dockerfile for Express API server
FROM node:18
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start", "dev"]