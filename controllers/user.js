import express from 'express';
import UserSchema from '../models/User.js';
import LocationSchema from '../models/Location.js';
import Provider from '../models/Provider.js';
import mongoose from 'mongoose';
// import bcrypt from "bcryptjs";

const router = express.Router();

export const storeLocation = async (req, res) => {
  const {longitude, latitude, city} = req.body;
  try {
    const userId = req.userId;
    const user = await UserSchema.findById(userId, {new: true});
    const location = await LocationSchema.findByIdAndUpdate(userId.location, {
      longitude: longitude,
      latitude: latitude,
      city: city,
    });
    await location.save();
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      msg: 'Internal server error',
    });
  }
};

export const nearByService = async (req, res) => {
  const {latitude, longitude, serviceName} = req.body;
  console.log(latitude);
  console.log(longitude);
  console.log(serviceName);
  console.log('NearBy');
  try {
    const providers = await Provider.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      {
        $match: {
          serviceName: new RegExp(serviceName, 'i'), // Case-insensitive search
        },
      },
    ]).limit(10); // Limit the number of results if needed

    res.json(providers);
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error finding nearest providers',
    });
  }
};

export const sendRequest = async (req, res) => {
  const {providerId, userId} = req.body;
  try {
    const req = await RequestSchema.create({
      providerId: providerId,
      userId: userId,
    });
    return res.status(200).send({
      success: true,
      msg: 'Request sent',
      data: req,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      msg: 'Internal server error',
    });
  }
};

export default router;
