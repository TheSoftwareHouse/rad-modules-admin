# Rad Modules Admin

## Configuration

To run project, you need to:

1. Clone this repository
2. Create file `.env` from `.env.dist`. `$ cp .env.dist .env`
3. Run `npm i`
4. To start development version: `npm start`

## Docker

To run dockerized version

1. Run `npm i`
2. Run `cp docker-compose.override.yml.dist docker-compose.override.yml`
3. Run `npm run docker-build-dev`
4. Run `npm run watch`
5. App is available on `http://localhost:3000`
