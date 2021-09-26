import jwt from 'jsonwebtoken';
import ErrorHandler from '../../errors';

import { User } from '../../schemas/user';

export const generateToken = async (user: User) => {
  const role = 'user';

  if (!user || !user.SKU) {
    throw new ErrorHandler(400, 'User not found');
  }

  if (!process.env.SALT_KEY) {
    throw new ErrorHandler(500, 'Internal server error, no salt key');
  }

  const token = jwt.sign(
    {
      userSKU: user.SKU,
      role,
    },
    process.env.SALT_KEY,
    {
      expiresIn: '365 d',
    }
  );

  return token;
};
