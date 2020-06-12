import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { useMainApp } from 'hooks';
import { useFormik } from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mseller.app/">
        mseller.app
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const SigInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string().required('Required')
});

const LoginForm: React.FunctionComponent = (): React.ReactElement => {
  const classes = useStyles();
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState(false);

  const { handleLogin } = useMainApp();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ email, password }) => {
      if (handleLogin) {
        setRequesting(true);
        setError(false);
        const success = await handleLogin(email, password);
        if (!success) {
          setRequesting(false);
          setError(true);
        }
      }
    },
    validationSchema: SigInSchema
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Collapse in={error}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Usuario o contraseña incorrectas
        </Alert>
      </Collapse>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo Electrónico"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={formik.handleChange}
        value={formik.values.email}
        error={!!formik.errors.email && formik.touched.email}
        helperText={formik.errors.email}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={formik.handleChange}
        value={formik.values.password}
        error={!!formik.errors.password && formik.touched.password}
        helperText={formik.errors.password}
      />
      <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
      <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={requesting}>
        Proceder
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Olvidó su contraseña?
          </Link>
        </Grid>
        <Grid item>
          {/* <Link href="#" variant="body2">
            Don't have an account? Sign Up
          </Link> */}
        </Grid>
      </Grid>
      <Box mt={5}>
        <Copyright />
      </Box>
    </form>
  );
};
export default LoginForm;
