import * as React from 'react';
import { Login, Business, User, Dashboard } from 'layouts';
import NotFound from 'components/notFound';
import { useMainApp } from 'hooks';
import { Route, Switch, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }): React.ReactElement => {
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
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export const CommonLayout = ({ component: Component }: { component: React.FunctionComponent }): React.ReactElement => {
  return (
    <Dashboard>
      <Component />
    </Dashboard>
  );
};

const Router: React.FunctionComponent = (): React.ReactElement => {
  return (
    <Switch>
      <Route path="/" component={Login} exact />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/business">
        <CommonLayout component={Business} />
      </PrivateRoute>
      <PrivateRoute path="/users/:businessId">
        <CommonLayout component={User} />
      </PrivateRoute>
      <Route component={NotFound} />
    </Switch>
  );
};

export default Router;
