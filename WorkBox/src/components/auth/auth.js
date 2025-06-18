// src/components/auth/auth.js
import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      Cookies.remove('token');
      return false;
    }
    return true;
  } catch (e) {
    Cookies.remove('token');
    return false;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (e) {
    return null;
  }
};
