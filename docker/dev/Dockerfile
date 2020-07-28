FROM node:12.2.0-alpine

WORKDIR /app

COPY . .

RUN npm config set unsafe-perm true
RUN npm config set unsafe-perm true && \
  rm -rf .git && \
  npm i --no-package-lock

CMD [""]