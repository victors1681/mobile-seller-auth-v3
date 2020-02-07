import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import BusinessList from "components/businessList";
 
const Business: FunctionComponent = (): ReactElement => {

  return (
    <Grid container component="main" >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}/>
      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={0} square>
      <BusinessList/>
      </Grid>
    </Grid>
  );
};

export default Business;
