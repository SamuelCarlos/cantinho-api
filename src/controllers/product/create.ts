import { Request, Response, NextFunction } from 'express';

import AWS, { S3 } from 'aws-sdk';

import QRCode from 'qrcode';

import { v4 as uuidv4 } from 'uuid';

import * as yup from 'yup';

import connection from '../../database';

import { productSchema } from '../../schemas/product';
import { userSchema } from '../../schemas/user';
import { getToken } from '../../services/authentication/getToken';
import { decodeToken } from '../../services/authentication/decodeToken';
import ErrorHandler from '../../errors/index';

const Product = connection.model('product', productSchema);

const CreateProductSchema = yup.object().shape({
  name: yup.string().required(),
  buy_price: yup.string().required(),
  sell_price: yup.string().required(),
  sell_price_cash: yup.string().required(),
  inventory: yup.number().required(),
});

const generateQR = async (text: string) => {
  try {
    return await QRCode.toDataURL(text, { width: 600 });
  } catch (err) {
    console.error(err);
  }
};

const uploadQR = async (SKU: string) => {
  const qr_code = await generateQR(SKU);

  if (!qr_code) {
    throw new ErrorHandler(500, 'Internal server error');
  }

  const buf = Buffer.from(qr_code.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  const S3 = new AWS.S3();

  const data = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `qr-${SKU}.png`,
    Body: buf,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: 'image/png',
  };

  try {
    const { Location } = await S3.upload(data as S3.Types.PutObjectRequest).promise();

    return Location;
  } catch (err) {
    console.error(err);
  }
};

export const CreateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, buy_price, sell_price, sell_price_cash, inventory } = req.body;

  const token = getToken(req);
  const { userSKU } = decodeToken(token);

  try {
    await CreateProductSchema.validate({ name, buy_price, sell_price, sell_price_cash, inventory })
      .then()
      .catch((error) => {
        return res.status(422).json({ [error.path]: error.message });
      });

    const created_at = new Date();

    const SKU = uuidv4();

    const qr = await uploadQR(SKU);

    const ProductData = {
      SKU,
      user_SKU: userSKU,
      name,
      buy_price,
      sell_price,
      sell_price_cash,
      inventory,
      qr_code: qr,
      created_at,
      updated_at: null,
      deleted_at: null,
    };

    const NewProduct = await new Product({
      ...ProductData,
      states: [{ name, buy_price, sell_price, sell_price_cash, created_at, deleted_at: null }],
    });

    await NewProduct.save();

    return res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
  }
};
