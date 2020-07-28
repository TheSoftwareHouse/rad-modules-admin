# Stage 1 - the build process
FROM node:12.2.0-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm i

COPY public ./public
COPY src ./src

COPY .env.build .env

RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.17.0-alpine

RUN apk update && apk add bash
COPY ./docker/prod/entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh

COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY docker/prod/nginx.conf /etc/nginx/conf.d
EXPOSE 80
ENTRYPOINT ["/bin/bash", "/usr/local/bin/entrypoint.sh"]
