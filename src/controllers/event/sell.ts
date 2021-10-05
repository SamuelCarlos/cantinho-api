import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { eventSchema } from '../../schemas/event';
import { productSchema } from '../../schemas/product';

import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';

const Event = connection.model('event', eventSchema);
const Product = connection.model('product', productSchema);

export const SellEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { SKU } = req.params;
  const { quantity = 1, discount = null } = req.body;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    let product = await Product.findOne({ SKU }).exec();

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    if (product.user_SKU !== userSKU) return res.status(401).json({ message: 'Produto não pertence a este usuario' });

    if (quantity <= 0) return res.status(400).json({ message: 'Quantity deve ser maior que 0' });

    if (product.inventory < quantity || product.inventory === 0)
      return res.status(422).json({ message: 'Não existe essa quantidade disponível em estoque' });

    let newEvent = await new Event({
      type: 'sell',
      quantity,
      discount,
      created_at: new Date(),
      product: {
        SKU: product.SKU,
        user_SKU: userSKU,
        name: product.name,
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        inventory: product.inventory,
        qr_code: product.qr_code,
      },
    });

    product = Object.assign(product, { inventory: product.inventory - quantity });

    await product.save();

    await newEvent.save();

    return res.status(201).json({ message: 'Evento gerado com sucesso!' });
  } catch (error) {
    console.error(error);
  }
};