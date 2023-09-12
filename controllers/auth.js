import express from 'express';
import validator from 'validator';

import bcrypt from 'bcrypt';
import * as jose from 'jose';
import otpGenerator from 'otp-generator';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

import UserSchema from '../models/User.js';
import OtpSchema from '../models/Otp.js';

const router = express.Router();

export const sendOtp = async (req, res) => {
  const {phoneNo, email, password} = req.body;
  console.log('send otp');
  if (phoneNo === undefined || !email === undefined || password === undefined) {
    return res.status(400).send({
      success: false,
      msg: 'Required field missing',
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      msg: 'Invalid email address',
    });
  }
  //password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      msg: 'Invalid password. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    });
  }
  if (!validator.isMobilePhone(phoneNo, 'en-IN')) {
    return res.status(400).send({
      success: false,
      msg: 'Invalid Phone Number',
    });
  }

  // checking if user exists or not

  const user = await UserSchema.findOne({phoneNo});

  if (user) {
    return res.status(400).send({
      success: false,
      msg: 'user already exists',
    });
  } else {
    if (await UserSchema.findOne({email})) {
      return res.status(400).send({
        success: false,
        msg: 'email already exists',
      });
    }
    if (await UserSchema.findOne({password})) {
      return res.status(400).send({
        success: false,
        msg: 'use strong password',
      });
    }
    // const newUser = UserSchema({
    //   phoneNo,
    //   email,
    //   password,
    // });
    // newUser.save();

    // generating otp

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });
    console.log(otp);

    // delete the previous otp if exists and create a new otp
    if (await OtpSchema.findOne({phoneNo})) {
      await OtpSchema.findOneAndDelete({phoneNo});
    }
    const userOtp = new OtpSchema({
      phoneNo,
      otp: await bcrypt.hash(otp, 10),
    });
    userOtp.save();
    try {
      const client = twilio(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);
      client.messages
        .create({
          body: `Your otp is ${otp} ans is valid for 5 Minutes`,
          to: `+91${phoneNo}`,
          from: process.env.SENDER_PHONE_NO,
        })
        .then(message => console.log(message))
        .catch(err => console.log(err));
      res.status(200).send({
        success: true,
        msg: 'Otp sent successfully and is Valid for 5 Minutes',
      });
    } catch {
      console.log(err);
      res.status(400).send({
        success: false,
        msg: 'Internal Server Error',
      });
    }
    // return res.status(200).send({
    //   success: true,
    //   msg: 'otp sent successfully',
    // });
  }
};

export const verifyOtp = async (req, res) => {
  console.log('verifyOtp');
  const {phoneNo, otp} = req.body;
  const otpHolder = await OtpSchema.findOne({phoneNo});
  console.log(otpHolder);
  if (!otpHolder) {
    return res.status(400).send({success: false, msg: 'This Otp Expired'});
  }
  console.log(otpHolder);
  const isOtpValid = await bcrypt.compare(otp, otpHolder.otp);
  if (!isOtpValid) {
    return res.status(400).send({
      success: false,
      msg: 'Incorrect Otp',
    });
  }
  if (isOtpValid) {
    console.log('true');
    return res.status(200).send({
      success: true,
      msg: 'right otp',
    });
  }

  return res.status(200).send({
    success: false,
  });
};

export const signup = async (req, res) => {
  const {phoneNo, email, password} = req.body;
  console.log('signup');
  try {
    if (email === undefined || password === undefined) {
      return res.status(400).send({
        success: false,
        msg: 'EmailId and Passsword required',
      });
    }
    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid email address',
      });
    }
    //password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid password. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }
    if (await UserSchema.findOne({email: email})) {
      return res.status(400).json({
        success: false,
        msg: 'Email already exists',
      });
    }
    if (await UserSchema.findOne({password: password})) {
      return res.status(400).json({
        success: false,
        msg: 'Use another password',
      });
    }
    // await sendOtp();
    const user = new UserSchema({
      phoneNo: phoneNo,
      email: email,
      password: await bcrypt.hash(password, 10),
    });
    user.isVerified = true;
    user.save();

    //creating token

    const token = jwt.sign(
      {email: user.email, id: user._id},
      process.env.SECRET
    );
    res.status(200).send({
      success: true,
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  console.log(email);
  console.log(password);
  try {
    if (email === undefined || password === undefined) {
      return res.status(400).send({
        success: false,
        msg: 'EmailId and Passsword required',
      });
    }

    const user = await UserSchema.findOne({email});
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'User not found',
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid password',
      });
    }
    const token = jwt.sign(
      {email: user.email, id: user._id, role: 'user'},
      process.env.SECRET
    );
    res.status(200).send({
      success: true,
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      msg: 'something went wrong',
    });
  }
};

export default router;
