import express from 'express';
import cors from 'cors';

require('dotenv').config();
require('./config/aws');

import router from './routes';

const app = express();

// Middlewares
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(3000, () => {
  console.log('server is listening on port 3000');
});

export default app;
