import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import cors from 'cors';

const hostname = '127.0.0.1';

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

const server = express();

const corsOptions = {
  corsOptions: true,
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));

server.use(express.json());
server.use('/api', router);

const port = process.env.PORT ?? 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
