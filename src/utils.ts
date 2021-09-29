import { Request } from 'express';
import jwt from 'jsonwebtoken';



export const generateToken = (user: { [key: string]: string; }) => {
  const { _id, name, email, password } = user;
  const pass = process.env.JWT_SECRET_KEY!;
  return jwt.sign({ _id, name, email, password }, pass, { expiresIn: '30d' });
};

export const isAuth = (req: Request) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    if (!decode) {
      return { error: 'Invalid Token' };
    } else {
      return decode;
    }

  } else {
    return { error: 'Unauthorized!!! Please Login' };
  }
};

