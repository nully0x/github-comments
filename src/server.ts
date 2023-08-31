import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes';


dotenv.config();
const app: Express = express();

app.use(express.json());

app.get('/api/status', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', routes);

const PORT: number | string = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
