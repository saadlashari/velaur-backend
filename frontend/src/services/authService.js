import { login as loginApi, register as registerApi } from './api';

export const loginUser = async (email, password) => {
  const res = await loginApi({ email, password });
  localStorage.setItem('velaur_token', res.data.access);
  localStorage.setItem('velaur_refresh', res.data.refresh);
  localStorage.setItem('velaur_user', JSON.stringify(res.data.user));
  return res.data.user;
};

export const registerUser = async (data) => {
  const res = await registerApi(data);
  localStorage.setItem('velaur_token', res.data.access);
  localStorage.setItem('velaur_refresh', res.data.refresh);
  localStorage.setItem('velaur_user', JSON.stringify(res.data.user));
  return res.data.user;
};

export const logoutUser = () => {
  localStorage.removeItem('velaur_token');
  localStorage.removeItem('velaur_refresh');
  localStorage.removeItem('velaur_user');
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('velaur_user'));
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!localStorage.getItem('velaur_token');