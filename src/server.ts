import express from 'express';
import { getJoke } from './modules/llm';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const joke:string = await getJoke();
  res.send(joke);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});