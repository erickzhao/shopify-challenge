# Shopify Backend Intern Challenge - Summer 2018

[Link to Challenge](https://backend-challenge-summer-2018.herokuapp.com/)

This is my submission for the Summer 2018 Backend Intern Challenge for Shopify. This application builds menus from the Shopify challenge API [hosted here](https://backend-challenge-summer-2018.herokuapp.com/challenges.json) and detects if they are valid or not. A valid menu has a maximum depth of 4 and has no cyclical references (i.e. no menu item can be a child of itself). The application output is of the following format:

```
{
  "valid_menus": [
    { "root_id": 2, "children": [4, 6] },
  ],
  "invalid_menus": [
    { "root_id": 1, "children": [1, 3, 5] }
  ]
}
```

## Usage

The application can either be run directly from the command line with NodeJS or accessed via an Express-based REST API.

### CLI
* Run `node validator.js [id]` via command line. The menus will be logged on standard output.
* The `id` argument takes in a number that represents the problem number that will be fetched from the Shopify API.
* If an invalid argument is passed in or the argument is left empty, `id` will default to `1`.
* e.g. `node validator.js 2` will validate the menus at `https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=2`.

### API

* Run `node app.js` to run the server locally on `localhost:3000`.
* `GET /menus` fetches the menus.
* The parameter `id` is available and behaves the same way as its CLI counterpart.
* e.g. `localhost:3000/menus?id=2` will validate the menus at `https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=2`.

