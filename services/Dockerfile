# D:\full stack\project-management-main\server\Dockerfile

FROM node:18-alpine 

WORKDIR /app
COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000
CMD ["npm", "start-dev"]