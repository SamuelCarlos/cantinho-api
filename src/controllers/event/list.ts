import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { eventSchema } from '../../schemas/event';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

const Event = connection.model('event', eventSchema);

export const ListEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { startDate = null, endDate = null, type = null } = req.body;
  let params = {};

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    if (startDate && !endDate)
      params = {
        ...params,
        created_at: { $gte: new Date(startDate) },
      };

    if (endDate && !startDate)
      params = {
        ...params,
        created_at: { $lte: new Date(endDate) },
      };

    if (endDate && startDate)
      params = {
        created_at: { $gte: new Date(startDate), $lte: new Date(endDate) },
      };

    if (type && type !== 'buy' && type !== 'sell') {
      return res.status(400).json({ message: "Tipo não existe, deve ser 'buy', 'sell' ou null " });
    }

    if (type) params = { ...params, type };

    params = { ...params, product: { user_SKU: userSKU } };

    const events = await Event.find(params);

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
  }
};
