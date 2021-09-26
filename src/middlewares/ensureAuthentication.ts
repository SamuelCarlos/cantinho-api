import { Request, Response, NextFunction } from 'express';
import connection from '../database';
import ErrorHandler from '../errors';

// Models
import { User } from '../schemas/user';
import { userSchema } from '../schemas/user';
const User = connection.model('user', userSchema);

// Services
import { decodeToken } from '../services/authentication/decodeToken';
import { getToken } from '../services/authentication/getToken';

const ensureUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req);
    const { userSKU, role } = decodeToken(token);

    if (role === 'user') {
      const user = await User.findOne({ SKU: userSKU });

      if (!user) {
        throw new ErrorHandler(401, 'token inválido');
      }
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export default ensureUserAuthenticated;
