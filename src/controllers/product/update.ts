import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

import { Product, productSchema } from '../../schemas/product';

const Product = connection.model('product', productSchema);

export const UpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { SKU } = req.params;

  const { name, buy_price, sell_price, inventory, created_at } = req.body;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    let product = await Product.findOne({ SKU }).exec();

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    if (product.user_SKU !== userSKU) return res.status(401).json({ message: 'Produto não pertence a este usuario' });

    if (product.deleted_at !== null) return res.status(422).json({ message: 'Produto não pode ser alterado' });

    let newProductData = {};

    if (name) newProductData = { ...newProductData, name };
    if (buy_price) newProductData = { ...newProductData, buy_price };
    if (sell_price) newProductData = { ...newProductData, sell_price };
    if (inventory) newProductData = { ...newProductData, inventory };
    if (created_at) newProductData = { ...newProductData, created_at };

    if (Object.keys(newProductData).length === 0)
      return res.status(400).json({ message: 'É necessário atualizar ao menos um campo' });

    newProductData = { ...newProductData, updated_at: new Date() };

    newProductData = {
      ...newProductData,
      states: [
        ...product.states,
        {
          name: name || product.name,
          buy_price: buy_price || product.buy_price,
          sell_price: sell_price || product.sell_price,
          created_at: created_at || product.created_at,
          deleted_at: null,
        },
      ],
    };

    product = Object.assign(product, newProductData);

    product = await product.save();

    return res.status(200).json({ message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
