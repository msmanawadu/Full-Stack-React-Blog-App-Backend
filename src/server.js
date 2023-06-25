import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';

// Load Firebase Private keys
const credentials = JSON.parse(fs.readFileSync('./credentials.json'));

// Setup Firebase Admin for the Firebase project
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

// Verify whether the request is authenticated
app.use(async (req, res, next) => {
  // Retrieve the auth token in request headers
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      // Load the firebase user for the auth token
      const user = await admin.auth().verifyIdToken(authtoken);

      // Attach the logged-in user to the request
      req.user = user;
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  // Default value firebase user
  req.user = req.user || {};
  return next();
});

// Get an article
app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  // Firebase user id
  const { uid } = req.user;
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    // Has the user already upvoted this article ?
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

// Verify whether the request is authenticated
app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

// Create a comment for an article
app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db.collection('articles').updateOne(
    { name },
    {
      $push: { comments: { postedBy: email, text } },
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
  // Firebase user id
  const { uid } = req.user;

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    // Has the user already upvoted this article ?
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      await db.collection('articles').updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          // Declare that user has already upvoted once
          $push: { upvoteIds: uid },
        }
      );
    }

    // Load the upvoted article
    const UpdatedArticle = await db.collection('articles').findOne({ name });

    res.json(UpdatedArticle);
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
