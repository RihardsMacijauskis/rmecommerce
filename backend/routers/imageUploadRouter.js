import multer from 'multer';
import express from 'express';
import { isAuth } from '../utils.js';

const uploadRouter = express.Router();

//Tiek izveidota mape "images" preču attēlu glabāšanai
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images/');
  },
  //Attēli tiks saglabāti mapē "images" ar formātu 'datums'.jpg
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

//iespējams augšupielādēt tikai vienu attēlu katrai precei 
uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default uploadRouter;