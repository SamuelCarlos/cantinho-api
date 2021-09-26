import { Request } from 'express';
import ErrorHandler from '../../errors';

// Services
import { extractBearer } from './extractBearer';

export const getToken = <T extends Request<any>>(req: T) => {
  const token = extractBearer(req.headers);
  if (!token || token === 'null') {
    throw new ErrorHandler(401, 'token invalido');
  }

  return token;
};
