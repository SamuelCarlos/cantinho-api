import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

import { productSchema } from '../../schemas/product';

const Product = connection.model('product', productSchema);

export const ListProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { search = null, page = 1, step = 10, with_deleted = true } = req.body;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    let searchParams = {};

    if (search !== null) searchParams = { name: { $regex: search, $options: 'i' } };
    if (with_deleted === false) searchParams = { ...searchParams, deleted_at: null };

    searchParams = { ...searchParams, user_SKU: userSKU };

    let products = await Product.find(searchParams)
      .skip(step * (page - 1))
      .limit(step)
      .select('-states')
      .exec();

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
