import { hash } from 'bcrypt';

export default (password: string, saltRounds = 12): Promise<string> => {
  return hash(password, saltRounds);
};
