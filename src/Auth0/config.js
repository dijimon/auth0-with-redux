export const AUTH_CONFIG = {
  clientId: 'ML242IyX2eG4gKQJOFKb48kTZugss5Aw',
  domain: 'catalyst-platform.eu.auth0.com',
  options: {
    allowedConnections: ['Username-Password-Authentication'],
    rememberLastLogin: false,
    allowShowPassword: true,
    allowSignUp: false,
    closable: false,
    autoclose: true,
    usernameStyle: 'email',
    auth: {
      responseType: 'token id_token',
      redirect: true,
      redirectUrl: 'http://localhost:3000/home',
      audience: 'https://nma.catalyst.intellecteu.com/api',
    },
    theme: {
      primaryColor: '#326fd1',
    },
    languageDictionary: {
      emailInputPlaceholder: 'login',
      passwordInputPlaceholder: 'password',
      title: 'Welcome to platform',
    },
  },
};
