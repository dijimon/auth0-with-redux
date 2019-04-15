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
      audience: 'https://nma.catalyst.intellecteu.com/api',
      //returnTo: 'http://localhost:3000/login',
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
