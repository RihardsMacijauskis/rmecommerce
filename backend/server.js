import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import ImageUploadRouter from './routers/imageUploadRouter.js';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';

dotenv.config();

const app = express();
//visi vaicājumi, kas satur datus, tiks "pārtulkoti" uz JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/webshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
//express.js serverim piesaista visus funkcionālās daļas datnes
app.use('/api/uploads', ImageUploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
//Piesaista maksājuma līdzekļa PayPal izmēģinājuma (sandbox) vidi
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sandbox');
});

const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, '/images')));

// app.get('/', (req, res) => {
//   res.send('Serveris ir izveidots');
// });
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
