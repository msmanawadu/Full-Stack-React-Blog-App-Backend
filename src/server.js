import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';

// Load Firebase Private keys
const credentials = JSON.parse(fs.readFileSync('../credentials.json'));

// Setup Firebase Admin for the Firebase project
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

// Get an article
app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

// Create a comment for an article
app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection('articles').updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );

  // Load the updated article
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send('The article does not exist !');
  }
});

// Upvote an article
app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  await db.collection('articles').updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );

  // Load the upvoted article
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send('The article does not exist');
  }
});

// Starting the MongoDB database connection
connectToDb(() => {
  console.log('Successfully connected to MongoDB database!');
  app.listen(8000, () => {
    console.info('Node-Express Web API/Server is listening on port 8000');
  });
});
