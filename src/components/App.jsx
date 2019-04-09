import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG } from '../Auth0/config';

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
      console.log('!!authenticated');

      this._lock.hide();

      this.props.login({
        lock: this._lock,
        idToken: authResult.idToken,
        accessToken: authResult.accessToken,
      });

      this._lock.on('authorization_error', error => {
        console.log('error ', error);
      });

      // this.props.history.push('/peers');
    });
  }

  showLogin = () => this._lock.show();

  render() {
    const { loggedIn } = this.props;
    console.log('App render loggedIn = ', loggedIn);

    return loggedIn ? (
      <Redirect to={{ pathname: '/' }} />
    ) : (
      <div className={Styles.loginContainer}>
        <div className={Styles.logoContainer}>
          <img alt="logo" width="300" src="/public/assets/CATALYST_BP_onDark.svg" />
          {this.showLogin()}
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
