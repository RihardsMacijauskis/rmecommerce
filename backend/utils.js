import jwt from 'jsonwebtoken';
import express from 'express';

export const generateToken = (user) => {
    return jwt.sign( //sign metode izveido "token" ar zemāk norādītajiem parametriem
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || 'somethingsecret', //"token" kriptēšana
        {
            expiresIn: '30d',
        }
    );
};

//Pārbauda, vai lietotājs ir autorizējies
export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret', (err, decode) =>{ //dekriptē "token"
            if(err){
                res.status(401).send({message: 'Invalid Token' });
            } else {
                req.user = decode; //Atgriež informāciju par lietotāju (kas tika nosūtīta jwt.sign metodē)
                next(); //saglabā saņemtos datus isAuth mainīgajā, kurus izmanto Router.js datnēs 
                }
            }
        );
    } else {
        res.status(401).send({message: 'No Token' });

    }
};

//Pārbauda, vai lietotājs ir administrators
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();//saglabā saņemtos datus isAdmin mainīgajā, kurus izmanto Router.js datnēs
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };