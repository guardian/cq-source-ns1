FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 7777

ENTRYPOINT ["node", "dist/index.js"]

CMD [ "serve", "--address", "[::]:7777", "--log-format", "json", "--log-level", "debug" ]
