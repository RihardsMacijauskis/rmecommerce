import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();


//Preču kārtošana pēc dažādiem kritērijiem
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const name = req.query.name || '';
    const category = req.query.category || '';
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const categoryFilter = category ? { category } : {};
    const order = req.query.order || '';
    const sortOrder =
    //No mazākās uz augstāko cenu
    order === 'lowest'
      ? { price: 1 }
    //No augstākās uz mazāko cenu
      : order === 'highest'
      ? { price: -1 }
    //Pēc labākajām atsauksmēm
      : order === 'toprated'
      ? { rating: -1 }
      : { _id: -1 };
    //Izvada preces pēc nosaukuma vai kategorijas
    const products = await Product.find({
      ...nameFilter,
      ...categoryFilter,
    }).sort(sortOrder);;
    res.send(products);
  })
);

//Preču izvade pēc kategorijas
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

//Noklusējuma preču izvade no statiskā masīva - data.js
productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Prece nav atrasta' });
    }
  })
);

//Jaunas preces pievienošana katalogam
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      //Noklusējuma vērtības ievades laukos
      name: 'Nosaukums',
      image: '/images/1.jpg',
      price: 0,
      category: 'Kategorija',
      brand: 'Ražotājs',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'Apraksts',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Prece izveidota', product: createdProduct });
  })
);

//Preces informācijas atjaunināšana
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      res.send({ message: 'Prece atjaunināta', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Prece nav atrasta' });
    }
  })
);

//Preces dzēšana
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id); //AJAX vaicājums - atrast preci pēc ID
    if (product) {
      const deleteProduct = await product.remove(); //Izdzēst preci no preču saraksta datubāzē
      res.send({ message: 'Prece izdzēsta', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Prece nav atrasta' });
    }
  })
);

//Atsauksmju iesniegšana
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'Atsauksmi iespējams iesniegt tikai 1 reizi!' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      //Aprēķina atsauksmju vidējo vērtību - pie šī brīža atsauksmju summas pieskaitot 
      //jaunas atsauksmes vērtību un izdalot ar kopējo atsauksmju skaitu
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) / 
        product.reviews.length; 

      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Atsauksme iesniegta',
        //Izvada jaunāko atsauksmi saraksta augšā
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Prece nav atrasta' });
    }
  })
);


export default productRouter;