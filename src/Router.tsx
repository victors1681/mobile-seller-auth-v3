import * as React from 'react';
import Login from 'layouts/Login';
import { Business, User }  from 'layouts/';
import NotFound from 'components/notFound';
import { useMainApp} from "hooks/";
import { Route, Switch, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const { isLogged } = useMainApp();
  return (
    <Route
      {...rest}
      render={({ location }) =>
         isLogged ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const Router = () => {
  return (
    <Switch>
      <Route path="/" component={Login} exact />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/business">
        <Business/>
      </PrivateRoute>
      <PrivateRoute path="/users">
        <User/>
      </PrivateRoute>
      <Route component={NotFound} />
    </Switch>
  );
};

export default Router;
