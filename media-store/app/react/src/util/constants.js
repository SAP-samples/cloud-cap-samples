export const AVAILABLE_LOCALES = ['en', 'fr', 'de'];

export const MESSAGE_TIMEOUT = 2;

export const requireEmployee = (user) => !!user && user.roles.includes('employee');

export const requireCustomer = (user) => !!user && user.roles.includes('customer');
