import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { eventSchema } from '../../schemas/event';
import { productSchema } from '../../schemas/product';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

const Event = connection.model('event', eventSchema);
const Product = connection.model('product', productSchema);

export const BuyEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { SKU } = req.params;
  const { quantity = 1 } = req.body;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    let product = await Product.findOne({ SKU }).exec();

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    if (product.user_SKU !== userSKU) return res.status(401).json({ message: 'Produto não pertence a este usuario' });

    if (quantity <= 0) return res.status(400).json({ message: 'Quantity deve ser maior que 0' });

    const newEvent = await new Event({
      type: 'buy',
      quantity,
      sell_type: null,
      discount: null,
      created_at: new Date(),
      product: {
        SKU: product.SKU,
        user_SKU: userSKU,
        name: product.name,
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        sell_price_cash: product.sell_price_cash,
        inventory: product.inventory,
        qr_code: product.qr_code,
      },
    });

    product = Object.assign(product, { inventory: product.inventory + quantity });

    await product.save();

    await newEvent.save();

    return res.status(201).json({ message: 'Evento gerado com sucesso!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
