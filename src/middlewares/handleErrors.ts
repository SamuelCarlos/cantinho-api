import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../errors';

export default (error: ErrorHandler | Error, _: Request, res: Response, __: NextFunction) => {
  if (error instanceof ErrorHandler) {
    return res.status(error.statusCode).json({
      message: typeof error.messages === 'string' ? [error.messages] : error.messages,
      ...(error.infos && { infos: error.infos }),
    });
  }

  console.error(error);

  if (error instanceof Error) {
    return res.status(500).json({
      message: [error.message],
    });
  }

  return res.status(500).json({ message: 'Unexpected error.', error });
};

export const handleNotFound = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    message: `Não foi possível encontrar o recurso: ${req.method} ${req.originalUrl}`,
  });
};
