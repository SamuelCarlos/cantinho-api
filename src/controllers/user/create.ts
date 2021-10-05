import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { v4 as uuidv4 } from 'uuid';

import hash from '../../infra/hash';

import { userSchema } from '../../schemas/user';
import { generateToken } from '../../services/authentication/generateToken';

import sendSMS from '../../services/SNS/sendSMS';

const User = connection.model('user', userSchema);

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, password } = req.body;
  try {
    if (!phone || !password) return res.status(400).json({ message: 'É preciso informar telefone e senha' });

    const existentUser = await User.findOne({ phone, deleted_at: null });

    if (existentUser) return res.status(422).json({ message: 'Usuário já cadastrado' });

    const verification_token = Array(6)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('')
      .toUpperCase();

    const newUser = new User({
      SKU: uuidv4(),
      phone,
      password: await hash(password, 12),
      is_verified: false,
      verification_token,
      created_at: new Date(),
    });

    const phoneNumber = phone.replace(/[^0-9]/g, '');

    await sendSMS(`SMS de confirmação de conta Cantinho. Codigo: ${verification_token}`, phoneNumber);

    await newUser.save();

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error(error);
  }
};
