import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG } from '../Auth0/config';
//import Button from './button';
import { login, logout } from '../store/user';

import Styles from './styles.scss';

// const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
// const domain = process.env.REACT_APP_AUTH0_DOMAIN

class App extends Component {
  constructor(props) {
    super(props);

    this._lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, AUTH_CONFIG.options);
  }

  componentDidMount() {
    this._lock.on('authenticated', authResult => {
      this._lock.hide();
      this.props.login({
        idToken: authResult.idToken,
        accessToken: authResult.accessToken,
      });
    });
  }

  showLogin = () => this._lock.show();

  render() {
    const { loggedIn } = this.props;
    console.log('App render  loggedIn = ', loggedIn);
    /*if (!loggedIn) {
      this.showLogin();
    }*/

    return (
      <div className={Styles.loginContainer}>
        <div className={Styles.logoContainer}>
          <img alt="logo" width="300" src="/public/assets/CATALYST_BP_onDark.svg" />
          {loggedIn ? (
            <button type="button" onClick={this.props.logout}>
              Log out
            </button>
          ) : (
            this.showLogin()
          )}
        </div>
        <div style={{ height: '100px' }} />
      </div>
    );
  }
}

App.propTypes = {
  loggedIn: bool.isRequired,
  login: func.isRequired,
  logout: func.isRequired,
};

const mapState = state => ({
  loggedIn: state.user.loggedIn,
});

const mapDispatch = {
  login,
  logout,
};

export default connect(
  mapState,
  mapDispatch,
)(App);
