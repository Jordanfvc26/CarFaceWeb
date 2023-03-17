#Primera Etapa
FROM node:16-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json  /app
COPY package-lock.json /app

RUN npm install --force

COPY . /app

RUN npm run build --prod

#Segunda Etapa
FROM nginx:1.8-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/dist/car-face-web /usr/share/nginx/html