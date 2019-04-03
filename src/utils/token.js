export const getCredentials = () => {
  const credentials = localStorage.getItem('credentials');
  console.log('credentials in localstorage=', JSON.parse(credentials));
  return credentials ? JSON.parse(credentials) : null;
};

export const saveCredentials = credentials => {
  console.log('save credentials to localstorage ', credentials);
  localStorage.setItem('credentials', JSON.stringify(credentials));
};

export const removeCredentials = () => localStorage.removeItem('credentials');
