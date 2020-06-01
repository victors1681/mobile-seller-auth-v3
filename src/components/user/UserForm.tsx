import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper, CircularProgress, Avatar, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useMainApp } from 'hooks';
import styled from 'styled-components';
import SwitchConfig from './SwitchConfig';

const AvatarProfile = styled(Avatar)`
  width: ${({ theme }) => theme.spacing(7)};
  height: ${({ theme }) => theme.spacing(7)};
`;
const Wrapper = styled(Paper)`
  padding: 19px;
`;

const Header = styled.div`
  display: flex;
  h6 {
    margin-right: auto;
  }
`;
const UserSchema = Yup.object().shape({
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('Requerido'),
  sellerCode: Yup.string().required('Requerido'),
  userType: Yup.string().required('Requerido'),
  password: Yup.string().required('Requerido')
});

interface SelectOptions {
  name: string;
  label: string;
  value: string;
}
const userType: SelectOptions[] = [
  {
    name: 'seller',
    label: 'Vendedor',
    value: 'seller'
  },
  {
    name: 'administrator',
    label: 'Administrador',
    value: 'administrator'
  }
];

const userRole: SelectOptions[] = [
  {
    name: 'normal',
    label: 'Normal',
    value: 'N'
  },
  {
    name: 'admin',
    label: 'Administrador iPad',
    value: 'A'
  },
  {
    name: 'manager',
    label: 'Supervisor',
    value: 'S'
  }
];

const CustomSelect = ({ defaultValue, handleChange, name, label, options }: { defaultValue: string; handleChange: any; name: string; label: string; options: SelectOptions[] }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select labelId="demo-simple-select-label" id={name} name={name} value={defaultValue} onChange={handleChange}>
        {options.map((option: SelectOptions) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export const UserForm = () => {
  const [userData, setUserData] = React.useState({} as IUser);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { userId, duplicate } = useParams();
  const {
    userHook: { requestUserById, addUser, isSellerCodeExist }
  } = useMainApp();

  const getUserData = React.useCallback(async () => {
    const result = await requestUserById(userId || '');

    if (duplicate) {
      const user = { ...result, email: '', password: '', firstName: '', lastName: '', sellerCode: '', phone: '' } as IUser;
      setUserData(user);
    } else {
      setUserData(result as IUser);
    }
    setLoading(false);
    console.error('Result Promise', result);
  }, [userId]);

  React.useEffect(() => {
    if (userId && userId !== 'new') {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [getUserData, userId]);

  const handleSubmission = React.useCallback(async (values: IUser) => {
    if (isSellerCodeExist) {
      const sellerCode = (values && values.sellerCode) || '';
      const exist = await isSellerCodeExist(sellerCode);

      console.log('exist', !exist);
      if (!exist) {
        console.log('addUser', values);
        addUser && addUser(values);
      }
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...userData },
    onSubmit: (values) => {
      // handleLogin(email, password);

      console.error(values, userData);
      handleSubmission(values);
    },
    validationSchema: UserSchema
  });
  return loading ? (
    <CircularProgress />
  ) : (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <Header>
          <Typography variant="h6" gutterBottom>
            User Edit
          </Typography>
          <AvatarProfile src={formik.values.photoURL} />
        </Header>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField required id="firstName" name="firstName" label="Nombre" fullWidth autoComplete="fname" onChange={formik.handleChange} value={formik.values.firstName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="lastName" name="lastName" label="Apollido" fullWidth autoComplete="lname" onChange={formik.handleChange} value={formik.values.lastName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="email" name="email" label="Correo" fullWidth autoComplete="email" onChange={formik.handleChange} value={formik.values.email} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="password"
              disabled={!!userId && !duplicate}
              required={!userId && !!duplicate}
              id="password"
              name="password"
              label="Clave"
              fullWidth
              autoComplete="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField required id="phone" name="phone" label="Teléfono" fullWidth autoComplete="phone" onChange={formik.handleChange} value={formik.values.phone} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField required id="sellerCode" name="sellerCode" label="Código" fullWidth autoComplete="sellerCode" onChange={formik.handleChange} value={formik.values.sellerCode} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField type="number" required id="warehouse" name="warehouse" label="No. Almacén" fullWidth autoComplete="sellerCode" onChange={formik.handleChange} value={formik.values.warehouse} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSelect name="userType" label="Tipo Usuario" options={userType} handleChange={formik.handleChange} defaultValue={formik.values.type} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSelect name="userLevel" label="Nivel de Usuario" options={userRole} handleChange={formik.handleChange} defaultValue={formik.values.userLevel} />
          </Grid>
          <SwitchConfig formik={formik} />
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox color="secondary" name="saveAddress" value="yes" />} label="Use this address for payment details" />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          {userId && !duplicate ? 'Editar Usuario' : 'Crear Usuario'}
        </Button>
      </form>
    </Wrapper>
  );
};

export default UserForm;
