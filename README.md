# Northcoders House of Games API

## Local Database connection

To prevent database information from being publicly available on github create two separate `.env.test` and `.env.development` files and ensure that they are both included in the `.gitignore`.
Add `PGDATABASE=<database_name_here>`, with the correct database name for that environment. The correct database names can be found in the `/db/setup.sql` file