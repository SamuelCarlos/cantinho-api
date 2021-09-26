import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import compare from '../../infra/compare';

import { userSchema } from '../../schemas/user';
import { generateToken } from '../../services/authentication/generateToken';

const User = connection.model('user', userSchema);

export const Signin = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, password } = req.body;
  try {
    if (!phone || !password) return res.status(400).json({ message: 'É preciso informar telefone e senha' });

    const existentUser = await User.findOne({ phone });

    if (!existentUser) return res.status(422).json({ message: 'Usuário não existente' });

    if (!existentUser.is_verified) return res.status(422).json({ message: 'Usuário não verificado' });

    const isEqualPassword = await compare(password, existentUser.password);

    if (!isEqualPassword) return res.status(400).json({ message: 'E-mail ou senha incorretos' });

    const token = await generateToken(existentUser);

    return res.status(200).json({ message: 'Usuário logado com sucesso', token });
  } catch (error) {
    console.error(error);
  }
};
