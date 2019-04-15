import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { Container, SideMenu } from '../../components/sidemenu';
import PrivateRoute from '../../components/privateRoute';

import Dashboard from '../Dashboard';
import { login, logout } from '../../store/user';

import { MENU_ITEMS } from '../../components/sidemenu/menu';

const RoutePath = ({ path }) => <h4>{path}</h4>;

//const Dashboard = () => <RoutePath path="/dashboard" />;
const Peers = () => <RoutePath path="/peers" />;
const Orderers = () => <RoutePath path="/orderers" />;
const CAS = () => <RoutePath path="/cas" />;
const Channels = () => <RoutePath path="/channels" />;
const Chaincodes = () => <RoutePath path="/chaincodes" />;

const Home = props => {

  const _logout = () => {
    props.logout(props.lock);
    props.history.push('/login');
  };

  return (
    <Container>
      <SideMenu isExpandable items={MENU_ITEMS} />
      <div className="main">
        <button type="button" onClick={_logout}>
          Log out
        </button>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/peers" component={Peers} />
          <Route path="/orderers" component={Orderers} />
          <Route path="/cas" component={CAS} />
          <Route path="/channels" component={Channels} />
          <Route path="/chaincodes" component={Chaincodes} />
        </Switch>
      </div>
    </Container>
  );
};

const mapState = state => ({
  loggedIn: state.user.loggedIn,
  lock: state.user.lock,
});

const mapDispatch = {
  login,
  logout,
};

export default connect(
  mapState,
  mapDispatch,
)(Home);
