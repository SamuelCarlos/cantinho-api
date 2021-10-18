import { Request, Response, NextFunction } from 'express';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

import connection from '../../database';

import { productSchema } from '../../schemas/product';

const Product = connection.model('product', productSchema);

export const ReactivateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { SKU } = req.params;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);
  try {
    if (!SKU) {
      return res.status(400).json({ message: 'SKU precisa ser informado' });
    }

    let product = await Product.findOne({ SKU }).exec();

    if (!product) return res.status(404).json({ message: 'Não foi encontrado produto com esse SKU' });

    if (product.user_SKU !== userSKU) return res.status(401).json({ message: 'Produto não pertence a este usuario' });

    if (product.deleted_at === null) return res.status(422).json({ message: 'Produto já ativo' });

    product = Object.assign(product, { updated_at: new Date(), deleted_at: null });

    await product.save();

    return res.status(200).json({ message: 'Produto reativado!' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
