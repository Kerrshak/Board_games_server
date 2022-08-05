## Hosted app
You can find an already hosted version of the app here https://board-game-reviews-by-kerrshak.herokuapp.com/api/

## What is this?
Currently this is built as a server that hosts boardgame reviews. It has functionality for users to add comments to reviews, see information about reviews, comments, categories, and users. There is additional functionality all of which can be found in the API link above. While this has been made as a server to host boardgame reviews it is primarily a demonstration of server based coding and could be used for a myriad of different purposes.

## How to set up
In CLI navigate to the directory you would like to clone the repo to and use: `git clone https://github.com/Kerrshak/Board_games_server`

Then `npm install` to install the relevant dependencies

Following this `npm run setup-dbs` then `npm run seed` to set up the dev and test databases and seed them with the data stored in `./db/data`

## .env-example
This is a placeholder only. When setting up your own testing environment you will need a .env.test and .env.development files where you have added the name of the appropriate databases. These names can be found in /db/setup.sql. Use the .env-example file as a template and add the database name here.

## Running tests
To run the tests in `./__test__/app.test.js` use `npm run test __tests__/app.test.js` or to run all tests `npm run test`

## Minimum versions
Node 17.0.29
PostgreSQL 14.4