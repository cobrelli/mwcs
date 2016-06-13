Monthly Wage Calculation System:
Reads worker shift information from CSV-file and outputs a table of worker salaries

How to run:
npm install
grunt serve

Running tests:
grunt test

Grunt tasks:
serve: runs webpack build (does not minify and split) and copies necessary files to public/, then starts server
test: runs webpack build, copies necessary files to public and runs mocha test task

Tests:
Mocha ran unit and integration tests (no e2e testing)

Todo:
- Improve layout
- Set up build with dist/, minify and split to vendor & app
- Perhaps support different encodings? (atm everything is setup except watch that updates encoding in directive)