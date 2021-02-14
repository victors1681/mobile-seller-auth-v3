import * as React from 'react';
import { Login, Business, User, Dashboard, UserEdit, BusinessEdit, Main, Messaging } from 'layouts';
import NotFound from 'components/notFound';
import { useMainApp, UserTypeEnum } from 'hooks';
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

const SuperUserRoutes = ({ children, ...rest }): React.ReactElement => {
  const { isLogged, currentUser } = useMainApp();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLogged && currentUser?.type === UserTypeEnum.superuser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/main',
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
      <PrivateRoute path="/main">
        <CommonLayout component={Main} />
      </PrivateRoute>
      <SuperUserRoutes exact path="/business">
        <CommonLayout component={Business} />
      </SuperUserRoutes>
      <SuperUserRoutes path="/business/edit/:businessId?">
        <CommonLayout component={BusinessEdit} />
      </SuperUserRoutes>
      <PrivateRoute path="/users/:businessId?">
        <CommonLayout component={User} />
      </PrivateRoute>
      <PrivateRoute path="/user/edit/:userId/:businessId/:duplicate?">
        <CommonLayout component={UserEdit} />
      </PrivateRoute>
      <PrivateRoute path="/messaging">
        <CommonLayout component={Messaging} />
      </PrivateRoute>
      <Route component={NotFound} />
    </Switch>
  );
};

export default Router;
