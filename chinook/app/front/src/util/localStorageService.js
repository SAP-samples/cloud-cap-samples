import { isValidUser } from './validateUser';
import { AVAILABLE_LOCALES } from './constants';

const setUserToLS = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

const getUserFromLS = () => {
  let userFromLS;
  try {
    userFromLS = JSON.parse(localStorage.getItem('user'));
    if (isValidUser(userFromLS)) {
      return userFromLS;
    }
  } catch (e) {
    console.error('User from local storage are not valid');
  }
  return undefined;
};

const getLocaleFromLS = () => {
  const localeFromLS = localStorage.getItem('locale');
  return localeFromLS && localeFromLS !== 'undefined' && AVAILABLE_LOCALES.includes(localeFromLS)
    ? localeFromLS
    : 'en';
};

const setLocaleToLS = (locale) => {
  localStorage.setItem('locale', locale);
};

export { setLocaleToLS, getLocaleFromLS, getUserFromLS, setUserToLS };
