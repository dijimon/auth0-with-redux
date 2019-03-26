export const AUTH_CONFIG = {
  clientId: 'ML242IyX2eG4gKQJOFKb48kTZugss5Aw',
  domain: 'catalyst-platform.eu.auth0.com',
  options: {
    allowedConnections: ['Username-Password-Authentication'],
    allowShowPassword: true,
    allowSignUp: false,
    closable: false,
    auth: {
      responseType: 'token id_token',
      redirect: true,
      sso: true,
      audience: 'https://nma.catalyst.intellecteu.com/api',
    },
    theme: {
      primaryColor: '#326fd1',
    },
    popupOptions: { width: 400, height: 400, left: 200, top: 300 },
    languageDictionary: {
      emailInputPlaceholder: 'login',
      passwordInputPlaceholder: 'password',
      title: 'Welcome',
    },
  },
};
