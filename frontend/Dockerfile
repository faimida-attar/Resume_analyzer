FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Run vite dev server and expose it
CMD ["npm", "run", "dev", "--", "--host"]
