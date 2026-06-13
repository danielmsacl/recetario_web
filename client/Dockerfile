
FROM node:20-slim


WORKDIR /app


COPY package*.json ./

RUN npm install --no-optional


COPY . .


RUN npm run build


EXPOSE 3000


CMD ["node", ".output/server/index.mjs"]