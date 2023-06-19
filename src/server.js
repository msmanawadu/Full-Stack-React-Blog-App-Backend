import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.listen(8000, () => {
  console.info('Node-Express Web API/Server is listening on port 8000');
});
