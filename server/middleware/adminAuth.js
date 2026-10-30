import { timingSafeEqual } from 'node:crypto';

export const requireAdminToken = (req, res, next) => {
  const configuredToken = process.env.ADMIN_DASHBOARD_TOKEN;
  if (!configuredToken) {
    return res.status(503).json({ message: 'Dashboard access is not configured on the server.' });
  }

  const authorization = req.get('authorization') || '';
  const [scheme, providedToken] = authorization.split(' ');
  if (scheme !== 'Bearer' || !providedToken) {
    return res.status(401).json({ message: 'Enter the dashboard access token to continue.' });
  }

  const expected = Buffer.from(configuredToken);
  const provided = Buffer.from(providedToken);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return res.status(401).json({ message: 'The dashboard access token is incorrect.' });
  }

  next();
};