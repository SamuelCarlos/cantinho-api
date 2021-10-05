import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

require('./config/aws');

import router from './routes';

const app = express();

// Middlewares
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is listening on port${process.env.PORT || '3000'}`);
});

export default app;
