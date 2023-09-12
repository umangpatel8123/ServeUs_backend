import express from 'express';
import path from 'path';
import fs from 'fs';

import ProviderSchema from '../models/Provider.js';
import LocationSchema from '../models/Location.js';
import Request from '../models/Request.js';

export const createProvider = async (req, res) => {
  const {phoneNo, serviceName, longitude, latitude, city} = req.body;
  console.log(phoneNo);
  console.log(serviceName);
  console.log(longitude);
  console.log(latitude);
  console.log(city);
  //   const imageFile = req.file;
  if (phoneNo === undefined || serviceName === undefined) {
    return res.status.send({
      success: false,
      msg: 'please provide the details',
    });
  }
  if (
    (longitude === undefined && latitude === undefined) ||
    city === undefined
  ) {
    return res.status(400).send({
      success: false,
      msg: 'Please provide the location',
    });
  }

  //image storing
  //   const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  //   const uploadStream = bucket.openUploadStream('profile_image.jpg');
  //   const readableImageStream = new Readable();
  //   readableImageStream.push(imageBuffer);
  //   readableImageStream.push(null); // End the stream
  //   readableImageStream.pipe(uploadStream);

  //   if (imageFile === undefined) {
  //     return res.status(400).send({
  //       success: false,
  //       msg: 'upload image',
  //     });
  //   }

  //   const imageFileName = `${Date.now()}-${imageFile.originalname}`;
  //   const imagePath = path.join(__dirname, '../uploads', imageFileName);

  //   fs.writeFileSync(imagePath, imageFile.buffer);

  const newProvider = new ProviderSchema({
    phoneNo: phoneNo,
    serviceName: serviceName,
    location: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      city: city,
    },
    // image: imageFileName,
  });
  const provider = await newProvider.save();
  return res.status(200).send({
    success: true,
    msg: 'created profile',
    data: provider,
  });
};

export const getProvider = async (req, res) => {
  const {email, password} = req.body;
  console.log(email);
  try {
    if (email === undefined || password === undefined) {
      return res.status(400).send({
        success: false,
        msg: 'EmailId and Passsword required',
      });
    }
    const provider = await ProviderSchema.find({email});
    console.log(provider);
    if (!provider) {
      return res.status(400).json({
        success: false,
        msg: 'Data not found',
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid password',
      });
    }
    const token = jwt.sign(
      {email: provider.email, id: provider._id, role: 'provider'},
      process.env.SECRET
    );
    return res.status(200).send({
      success: true,
      data: provider,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
};

export const acceptRequest = async (req, res) => {
  const {requestId} = req.body;
  console.log(requestId);
  try {
    const request = await RequestSchema.findById(requestId, {new: true});
    request.status = 'accepted';
    await request.save();
    return res.status(200).send({
      success: true,
      msg: 'Request Accepted',
      data: request,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
};

export const rejectRequest = async (req, res) => {
  const {requestId} = req.body;
  console.log(requestId);
  try {
    const request = await RequestSchema.findById(requestId, {new: true});
    request.status = 'rejected';
    await request.save();
    return res.status(200).send({
      success: true,
      msg: 'Request Rejected',
      data: request,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
};

export const getRequests = async (req, res) => {
  const {providerId} = req.body;
  console.log(providerId);
  try {
    const requests = await RequestSchema.find({providerId: providerId});
    return res.status(200).send({
      success: true,
      msg: 'Requests',
      data: requests,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
};

export default router;
