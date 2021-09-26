import { IncomingHttpHeaders } from 'http';

export const extractBearer = (headers: IncomingHttpHeaders) => {
  const authHeader = headers.authorization;

  if (!authHeader) return null;

  const [, token] = authHeader.split(' ');

  return token;
};
