import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  const token = Cookies.get('token');
  return !!token;
};

export const getUserRole = () => {
  const token = Cookies.get('token');
  if (!token) return null;

  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));
  return decoded.role || null;
};
