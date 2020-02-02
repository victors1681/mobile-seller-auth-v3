import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from 'components/loginForm';
import Logo from 'assets/images/logo/Logo.png';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage:
      'url(https://source.unsplash.com/collection/962362/desktop-and-tech)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}));

const LogoContainer = styled.img`
  height: 81px;
  margin-bottom: 50px;
`;

const Login: FunctionComponent = (): ReactElement => {
  const classes = useStyles();
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <LogoContainer src={Logo} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <LoginForm />
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
