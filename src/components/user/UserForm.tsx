import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper, CircularProgress } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
// import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useMainApp } from 'hooks';
import styled from 'styled-components';
import SwitchConfig from './SwitchConfig';

const Wrapper = styled(Paper)`
  padding: 19px;
`;
const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string().required('Required')
});

export const UserForm = () => {
  const [userData, setUserData] = React.useState();
  const [loading, setLoading] = React.useState<boolean>(true);

  const { userId } = useParams();
  const { requestUserById } = useMainApp();

  console.error(userId);

  const getUserdata = React.useCallback(async () => {
    const result = await requestUserById(userId);
    setUserData(result);
    setLoading(false);
    console.error('Result Promise', result);
  }, []);

  React.useEffect(() => {
    getUserdata();
  }, [getUserdata]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...userData },
    onSubmit: (values) => {
      // handleLogin(email, password);
      console.error(values, userData);
    },
    validationSchema: UserSchema
  });
  return loading ? (
    <CircularProgress />
  ) : (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h6" gutterBottom>
          User Edit
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField required id="firstName" name="firstName" label="First name" fullWidth autoComplete="fname" onChange={formik.handleChange} value={formik.values.firstName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="lastName" name="lastName" label="Last name" fullWidth autoComplete="lname" onChange={formik.handleChange} value={formik.values.lastName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="email" name="email" label="Correo" fullWidth autoComplete="email" onChange={formik.handleChange} value={formik.values.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="phone" name="phone" label="Teléfono" fullWidth autoComplete="phone" onChange={formik.handleChange} value={formik.values.phone} />
          </Grid>
          <SwitchConfig formik={formik} />
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox color="secondary" name="saveAddress" value="yes" />} label="Use this address for payment details" />
          </Grid>
        </Grid>
      </form>
    </Wrapper>
  );
};

export default UserForm;
