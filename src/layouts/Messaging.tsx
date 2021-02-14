import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { UserList } from 'components/user';

const User = (): React.ReactElement => {
  return (
    <Grid container component="main">
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} />
      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={0} square>
        <UserList />
      </Grid>
    </Grid>
  );
};

export default User;
