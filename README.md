# Northcoders NC-Games API

This back end API was designed using Node.js to make HTTP requests through various endpoints to a PosgreSQL database

Information contained in the database includes:

- game reviews
- game categories
- users
- user comments on reviews
- user votes on reviews

## Link to the API

This app is currently hosted by ElephantSPL and Cyclic at the following link:
https://oluc94-nc-games.cyclic.app/api

## Local Database connection

To prevent database information from being publicly available on github create two separate `.env.test` and `.env.development` files and ensure that they are both included in the `.gitignore`.
Add `PGDATABASE=<database_name_here>`, with the correct database name for that environment. The correct database names are `nc_games` and `nc_games_test`.

## Intructions on how to use this repository

1. Create your own fork of this repository
2. Using the following commands, clone your fork of this repository onto your local machine and then `cd` into it:
   - `git clone <repo-url>`
   - `cd fe-nc-games`
3. Navigate to the root folder of this repository and then install all dependencies using the command `npm install`.
4. Seed the database locally by running the command `npm run seed`
5. To view the outcome of the component test, run the comment `npm test`

## Node.js and Postgres requirements

To run this project locally Node.js version 18 and PostgreSQL version 14.5 are the minimum requirements.
