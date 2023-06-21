# Full-Stack React Blog App - Backend

This is a Node-Express REST Web API / Web Server app that is implemented as the back-end, server-side application for a Blog app which is implemented using Javascript MERN stack.

## Getting Started :rocket:

```bash
npm install
npm start
```

This Node-Express REST Web API / Web Server runs on URL [http://localhost:8000](http://localhost:8000)

There are 3 routes:

- GET http://localhost:8000/api/articles/:name - Get a specific article.
- POST http://localhost:8000/api/articles/:name/comments - Create a comment for an article.
- PUT http://localhost:8000/api/articles/:name/upvote - Upvote for an article.

The REST Web API transacts with a MongoDB database server for database CRUD operations.

The MongoDB database server is configured to run on [mongodb://127.0.0.1:27017](mongodb://127.0.0.1:27017)

The REST Web API utilizes the native MongoDB database driver for Node.js as the database middleware to perform database CRUD operations with the MongoDB database.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Starts the Node-Express REST Web API / Web Server and begins to listen on URL [http://localhost:8000](http://localhost:8000)

### `npm test`

Launches the Jest test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Development

This project uses EditorConfig to standardize text editor configuration. Visit [EditorConfig](https://editorconfig.org) for details.

This project uses ESLint to detect suspicious code in Javascript files. Visit [ESLint](https://eslint.org) for details.

## Testing

This project uses Jest for testing. Visit [Jest](https://jestjs.io) for details.
