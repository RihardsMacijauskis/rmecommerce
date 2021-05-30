import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name'); //AJAX vaicājums, lai atrastu visu lietotāju veiktos pasūtījumus un sarakstā attēlotu arī lietotāja vārdu 
    res.send(orders);
  })
);
//Savu veikto pasūtījumu izvade
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }); //AJAX vaicājums, lai atrastu veiktos pasūtījumus pēc lietotāja ID
    res.send(orders);
  })
);

//Pasūtījuma izveide
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save(); //AJAX vaicājums saglabāt izveidoto pasūtījumu mainīgajā "createdOrder"
      res
        .status(201)
        .send({ message: 'Izveidots jauns pasūtījums', order: createdOrder });
    }
  })
);

//Pasūtījuma meklēšana pēc ID
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Pasūtījums nav atrasts' });
    }
  })
);

//Pasūtījuma apmaksa
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      //Ja pasūtījums apmaksāts veiksmīgi, fiksē tā statusu un laiku, kad tas veikts
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Pasūtījums apmaksāts', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Pasūtījums nav atrasts' });
    }
  })
);

//Pasūtījuma atcelšana (dzēšana)
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Pasūtījums dzēsts', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Pasūtījums nav atrasts' });
    }
  })
);


//Pasūtījuma piegādes statusa maiņa
orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      //Nomaina piegādes statusu uz "Piegādāts" un fiksē pulksteņlaiku
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: 'Pasūtījums piegādāts', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Pasūtījums nav atrasts' });
    }
  })
);

export default orderRouter;