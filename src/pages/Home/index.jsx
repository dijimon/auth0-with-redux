import React from 'react';
import { connect } from 'react-redux';

import { login, logout } from '../../store/user';

const Home = props => {
  return (
    <section>
      <h1>Peers</h1>
      <button type="button" onClick={props.logout}>
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
)(Home);
