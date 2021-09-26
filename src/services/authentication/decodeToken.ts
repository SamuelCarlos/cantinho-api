import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorHandler from '../../errors';

interface IJwtPayload extends JwtPayload {
  role: 'user';
  userSKU: string;
}

export const decodeToken = (token: string) => {
  if (process.env.SALT_KEY) {
    try {
      return jwt.verify(token, process.env.SALT_KEY) as IJwtPayload;
    } catch (error) {
      throw new ErrorHandler(401, 'Token inválido');
    }
  }
  throw new ErrorHandler(500, 'Internal server error.');
};
