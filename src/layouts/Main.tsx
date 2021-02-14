import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import MainDashboard from 'components/main';

const Main = (): React.ReactElement => {
  return (
    <Grid container component="main">
      <CssBaseline />
      <MainDashboard />
    </Grid>
  );
};

export default Main;
