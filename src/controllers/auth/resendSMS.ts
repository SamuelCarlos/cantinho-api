import { Request, Response, NextFunction } from 'express';

import connection from '../../database';

import { userSchema } from '../../schemas/user';
import { generateToken } from '../../services/authentication/generateToken';
import sendSMS from '../../services/SNS/sendSMS';

const User = connection.model('user', userSchema);

export const ResendSMS = async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;
  try {
    if (!phone) return res.status(400).json({ message: 'É preciso informar telefone' });

    let existentUser = await User.findOne({ phone });

    if (!existentUser) return res.status(404).json({ message: 'Não existe usuário com esse telefone.' });

    if (existentUser.is_verified) return res.status(422).json({ message: 'Usuário já verificado' });

    const verification_token = Array(6)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('')
      .toUpperCase();

    existentUser = Object.assign(existentUser, { verification_token });

    const phoneNumber = phone.replace(/[^0-9]/g, '');

    await sendSMS(`SMS de confirmação de conta Cantinho. Codigo: ${verification_token}`, phoneNumber);

    return res.status(200).json({ message: 'SMS reenviado' });
  } catch (error) {
    console.error(error);
  }
};
