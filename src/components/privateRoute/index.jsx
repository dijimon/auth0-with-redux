import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, user, redirect, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!user.loggedIn) {
          return (
            <Redirect
              to={{
                pathname: redirect,
                state: { from: props.location },
              }}
            />
          );
        }
        return <Component {...rest} {...props} />;
      }}
    />
  );
};

PrivateRoute.defaultProps = { redirect: '/login' };

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  redirect: PropTypes.string,
};

const mapState = state => ({
  user: state.user,
});

export default connect(mapState)(PrivateRoute);
