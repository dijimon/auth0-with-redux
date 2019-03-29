export const AUTH_CONFIG = {
  clientId: 'ML242IyX2eG4gKQJOFKb48kTZugss5Aw',
  domain: 'catalyst-platform.eu.auth0.com',
  options: {
    allowedConnections: ['Username-Password-Authentication'],
    rememberLastLogin: false,
    allowShowPassword: true,
    allowSignUp: false,
    closable: true,
    autoclose: true,
    auth: {
      responseType: 'token id_token',
      redirect: true,
      audience: 'https://nma.catalyst.intellecteu.com/api',
    },
    theme: {
      primaryColor: '#326fd1',
    },
    languageDictionary: {
      emailInputPlaceholder: 'login',
      passwordInputPlaceholder: 'password',
      title: 'Welcome',
    },
  },
};
