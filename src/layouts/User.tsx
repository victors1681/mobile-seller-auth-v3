import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
 



const User: FunctionComponent = (): ReactElement => {
 
  return (
    <Grid container component="main" >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}/>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        Users
      </Grid>
    </Grid>
  );
};

export default User;
