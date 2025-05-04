import express from 'express';
import cors from 'cors';
import { getJoke, queryDB } from './modules/llm';

const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(cors({
  origin: ["http://localhost:5173","https://foodtoken-web.vercel.app"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const joke:string = await getJoke();
  res.send(joke);
});

app.post('/chat', async (req, res) => {
  // read body variable named "query" from express request object
  const query = req.body.query as string;
  const text:string = await queryDB(query);
  res.status(200).json({text});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
