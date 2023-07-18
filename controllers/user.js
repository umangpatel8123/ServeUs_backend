import express from "express";
import UserSchema from "../models/User.js";
import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const router = express.Router();

export const availableRoutes = async (req, res) => {
  // const { username, password } = req.body;
  const username = "umangg";
  // const password = "test";

  // create user
  const user = new UserSchema({
    username: username,
    // password: password,
  });
  user.save();

  // const user = await UserSchema.findOne({ username: username });
  // const user = await UserSchema.find({});

  // findOneAndUpdate
  // const {_id}=req.body;
  // const user = await UserSchema.findByIdAndUpdate(
  //   _id,
  //   { username: "asdfas", password: "asdfasdf" }
  // );

  // await bcrypt.hash(password, 10);
  // const checkPassword = await bcrypt.compare(password, user.password);

  res.status(200).send({
    success: "true",
    user: user,
  });
};

export default router;
