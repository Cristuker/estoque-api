import express from 'express';
import routes from './routes';
import './app/database';

const app = express();

const port = process.env.PORT || 3333;

app.use(express.json());

app.use(routes);

app.listen(port);

// eslint-disable-next-line no-console
console.log(`Server running on port: ${port}`);
