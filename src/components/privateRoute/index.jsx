import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, isAuthenticated, redirect: pathname, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        console.log(isAuthenticated.user, 'loggedIn---');
        if (!isAuthenticated.user.accessToken) {
          return (
            <Redirect
              to={{
                pathname,
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
  isAuthenticated: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  redirect: PropTypes.string,
};

export default PrivateRoute;
