import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

import { productSchema } from '../../schemas/product';

const Product = connection.model('product', productSchema);

export const ReadProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { SKU } = req.params;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    const product = await Product.findOne({ SKU }).exec();

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    if (product.user_SKU !== userSKU) return res.status(401).json({ message: 'Produto não pertence a este usuario' });

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
