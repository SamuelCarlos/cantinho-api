import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { v4 as uuidv4 } from 'uuid';

import hash from '../../infra/hash';

import { userSchema } from '../../schemas/user';
import { generateToken } from '../../services/authentication/generateToken';

import sendSMS from '../../services/SNS/sendSMS';

const User = connection.model('user', userSchema);

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'É preciso informar email e senha' });

    const existentUser = await User.findOne({ email });

    if (existentUser) return res.status(422).json({ message: 'Usuário já cadastrado' });

    const newUser = new User({
      SKU: uuidv4(),
      email,
      password: await hash(password, 12),
      created_at: new Date(),
    });

    await sendSMS('teste', '27981275195');

    await newUser.save();

    const token = await generateToken(newUser);

    return res.status(201).json({ message: 'Usuário criado com sucesso', token });
  } catch (error) {
    console.error(error);
  }
};
