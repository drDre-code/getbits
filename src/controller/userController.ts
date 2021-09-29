import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User from '../model/userModel';
import { generateToken } from '../utils';


export const loginUser = async (email: string, password: string) => {

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({
    email,
    password,
  });

  if (error) return { error: error.details[0].message };
  const user = await User.findOne({ email });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      return {
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user)
        }
      };
    } else {
      return { error: 'Invalid password' };
    }
  }

  return { error: `User with ${email} doesn't exists` };

};

export const registerUser = async (name: string, email: string, password: string) => {

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  //Data Validation
  const { error } = schema.validate({ name, email, password });
  if (error) return { error: error.details[0].message };

  const user = { name, email, password: bcrypt.hashSync(password, 8) };

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return { error: "User already exists" };
    }
    const newUser = new User({ ...user });
    const createdUser = await newUser.save() as unknown as { [key: string]: string; };

    return {
      data: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        token: generateToken(createdUser)
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
};


