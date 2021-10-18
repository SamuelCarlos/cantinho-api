import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

import { productSchema } from '../../schemas/product';

const Product = connection.model('product', productSchema);

export const ListProducts = async (req: Request, res: Response, next: NextFunction) => {
  const params = req.query;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  const { search, page, step, with_deleted } = params;

  const parsedParams = {
    search: typeof search === 'string' && search.length > 0 ? search.toString() : null,
    page: Number.isNaN(Number(page)) ? 1 : Number(page),
    step: Number.isNaN(Number(step)) ? 10 : Number(step),
    with_deleted: with_deleted === 'true' ? true : false,
  } as const;

  try {
    let searchParams = {};

    if (parsedParams.search !== null) searchParams = { name: { $regex: search, $options: 'i' } };
    if (parsedParams.with_deleted === false) searchParams = { ...searchParams, deleted_at: null };
    searchParams = { ...searchParams, user_SKU: userSKU };
    const products = await Product.find(searchParams)
      .skip(parsedParams.step * (parsedParams.page - 1))
      .limit(parsedParams.step)
      .select(['-states', '-__v', '-user_SKU', '-_id'])
      .exec();

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
