import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

//Noklusējuma lietotāju uzstādīšana ar statisko JSON "sarakstu" (masīvu) - data.js
userRouter.get(
    '/seed', 
    expressAsyncHandler( async (req, res) =>{
        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
    })
);

//Pieslēgšanās
userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
      const user = await User.findOne({ email: req.body.email }); //Sūta AJAX pieprasījumu, lai atrastu lietotāja e-pastu datubāzē
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {//Salīdzina ievades laukā ievadīto paroli ar datubāzē esošo
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user), //izveido token - "žetonu", lai autentificētu lietotāju dažādiem pieprasījumiem
          });
          return;
        }
      }
      res.status(401).send({ message: 'Nepareizs e-pasts vai parole' });
    })
  );
  

  //Reģistrācija
  userRouter.post('/register', expressAsyncHandler(async(req, res) => {
    //Veic lietotāja reģistrāciju, ievadot vārdu, e-pastu, paroli
    const user = new User({ 
      name: req.body.name,
      email: req.body.email,
      //paroles kriptēšana
      password: bcrypt.hashSync(req.body.password, 8),
  });
  const createdUser = await user.save(); //AJAX pieprasījums, lai saglabātu tikko reģistrēto lietotāju datubāzē
  res.send({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    token: generateToken(createdUser),
  })
})
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Lietotājs nav atrasts' });
    }
  })
);


//Lietotāja profila izvade
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    //Apskatot savu (lietotāja) profilu, iespējams atjaunot informāciju (vārdu, e-pastu, paroli)
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save(); //Saglabā atjaunotos datus
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);


userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

//Lietotāja dzēšana
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); //AJAX pieprasījums atrast lietotāju pēc ID
    if (user) {
      if (user.email === 'rihardsmacijauskis@gmail.com') {
        res.status(400).send({ message: 'Izdzēst administratora kontu nav iespējams' });
        return;
      }
      const deleteUser = await user.remove(); //AJAX pieprasījums dzēst lietotāju no datubāzes
      res.send({ message: 'Lietotājs izdzēsts', user: deleteUser });
    } else {
      res.status(404).send({ message: 'Lietotājs nav atrasts' });
    }
  })
);

//Lietotāja datu atjaunināšana
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // user.isSeller = req.body.isSeller || user.isSeller;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'Lietotājs atjaunināts', user: updatedUser });
    } else {
      res.status(404).send({ message: 'Lietotājs nav atrasts' });
    }
  })
);


export default userRouter;