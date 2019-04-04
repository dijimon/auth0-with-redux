import React from 'react';
import { connect } from 'react-redux';

import { login, logout } from '../../store/user';

const Peers = props => {
  const _logout = () => {
    props.logout();
    props.history.push('/login');
  };

  return (
    <section>
      <h1>Peers</h1>
      <button type="button" onClick={_logout}>
        Log out
      </button>
    </section>
  );
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
)(Peers);
