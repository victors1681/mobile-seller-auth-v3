import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { UserForm } from 'components/user';

const UserEdit = (): React.ReactElement => {
  return (
    <Grid container component="main">
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} />
      <Grid item xs={12} sm={12} md={12}>
        <UserForm />
      </Grid>
    </Grid>
  );
};

export default UserEdit;
