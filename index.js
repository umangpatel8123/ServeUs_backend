import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const hostname = '127.0.0.1';

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

const server = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const corsOptions = {
  corsOptions: true,
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Uploads directory
  },
  filename: (req, file, cb) => {
    console.log(file);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({storage: storage});

server.use(cors(corsOptions));

server.use(express.json());
server.use(express.static(path.join(__dirname, 'uploads')));
server.use('/api', router);

const port = process.env.PORT ?? 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
