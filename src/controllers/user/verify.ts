import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { userSchema } from '../../schemas/user';
import { generateToken } from '../../services/authentication/generateToken';

const User = connection.model('user', userSchema);

export const VerifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { verification_token, phone } = req.body;
  try {
    if (!phone || !verification_token) return res.status(400).json({ message: 'É preciso informar telefone e token' });

    let existentUser = await User.findOne({ phone });

    if (!existentUser) return res.status(404).json({ message: 'Não existe usuário com esse telefone.' });

    if (existentUser.verification_token !== verification_token)
      return res.status(422).json({ message: 'Token incorreto.' });

    existentUser = Object.assign(existentUser, { is_verified: true, verification_token: null });

    await existentUser.save();

    const token = await generateToken(existentUser);

    return res.status(200).json({ message: 'Usuário verificado com sucesso', token });
  } catch (error) {
    console.error(error);
  }
};
