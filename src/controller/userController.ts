import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { v1 as uuid } from 'uuid';
import { uploadData, findData } from '../db/dynamo';
import { generateToken } from '../utils';

interface Info {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Data {
  [key: string]: string | Info;
};


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

  const user = await findData('getbits-user', { email }) as { [key: string]: string; };

  if (user) {
    if (user.error) {
      return user;
    }
    if (bcrypt.compareSync(password, user.password)) {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user)
        }
      };
    } else {
      return { error: 'Invalid password' };
    }
  };

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

  const user = { id: uuid(), name, email, password: bcrypt.hashSync(password, 8) };

  try {
    const data = await findData('getbits-user', { email });
    if (data) {
      if (data.error) {
        return data;
      }
      return { error: "User already exists" };
    }
    const response = await uploadData('getbits-user', user) as { [key: string]: string; };
    if (response.error) {
      return { error: response.error };
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user)
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
};


