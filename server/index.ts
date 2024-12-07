import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { router } from './src/routes';
import connectToDatabase from './src/database';

connectToDatabase();
 
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded())

app.use(bodyParser.json())

app.get('/health', (req: Request, res: Response) => {
  res.send('I\'m healthy!');
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Sudoku App is listening at http://localhost:${port}`);
});
