import express from 'express';
import jwt from 'jsonwebtoken';
import * as jose from 'jose';
import UserSchema from '../models/User';

const router = express.Router();

export const isAuthenticated = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(400).send({success: false, msg: 'Auth Token not found'});
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(400).send({success: false, msg: 'Invalid Token'});
  }
  try {
    if (token) {
      const user = jwt.verify(token, process.env.SECRET);
      req.userId = user.id;
    } else {
      return res.status(401).send({
        success: false,
        msg: 'Unauthorized user',
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
};

export default router;
