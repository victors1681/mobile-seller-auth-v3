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
import { toast } from 'react-toastify';
import SwitchConfig, { fields as defaultFieldValues } from './SwitchConfig';

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

const UserSchemaNoPassword = {
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('Requerido'),
  sellerCode: Yup.string().required('Requerido'),
  type: Yup.string().required('Requerido')
};
const UserSchema = {
  ...UserSchemaNoPassword,
  password: Yup.string().required('Requerido')
};

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

interface ICustomSelect {
  defaultValue: string;
  handleChange: any;
  name: string;
  label: string;
  options: SelectOptions[];
  required: boolean;
}
const CustomSelect = ({ defaultValue, handleChange, name, label, options, required }: ICustomSelect) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={name} required={required}>
        {label}
      </InputLabel>
      <Select labelId={name} id={`${name}-${label}`} name={name} value={defaultValue} onChange={handleChange}>
        {options.map((option: SelectOptions) => (
          <MenuItem key={option.name} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

enum Actions {
  new = 'new',
  duplicate = 'duplicate',
  edit = 'edit'
}

const formInit = {
  password: '',
  email: '',
  photoURL: '',
  business: '',
  firstName: '',
  lastName: '',
  phone: '',
  sellerCode: '',
  type: '',
  userLevel: '',
  warehouse: '',
  ...defaultFieldValues.reduce((acc, current) => ({ ...acc, [current.name]: current.value }), {})
};

export const UserForm = () => {
  const [userData, setUserData] = React.useState((formInit as unknown) as IUser);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [userAction, setUserAction] = React.useState<Actions>(Actions.new);

  const { userId, businessId, duplicate } = useParams();
  const {
    userHook: { requestUserById, addUser, isSellerCodeExist, updateUser }
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
    if (userId !== Actions.new && duplicate) {
      setUserAction(Actions.duplicate);
      getUserData();
    } else if (userId !== Actions.new && !duplicate) {
      setUserAction(Actions.edit);
      getUserData();
    } else {
      setUserAction(Actions.new);
      setLoading(false);
    }
  }, [getUserData, userId]);

  const handleSubmission = React.useCallback(
    async (values: IUser, resetForm: any) => {
      if (isSellerCodeExist) {
        const sellerCode = (values && values.sellerCode) || '';
        const exist = await isSellerCodeExist(sellerCode, businessId, userId);

        if (!exist && businessId) {
          if (userAction === Actions.edit) {
            updateUser(values, businessId);
          } else {
            //new or duplicate add new user
            const isCreated = await addUser(values, businessId);
            if (isCreated) {
              //reset form
              resetForm();
            }
          }
        } else {
          if (exist) {
            toast.error('El código de vendedor ya existe');
          }
          if (!businessId) {
            toast.error('Id de la empresa no existe en la url');
          }
        }
      }
    },
    [businessId, userId, userAction]
  );

  const getLabel = React.useCallback(() => {
    if (userAction === Actions.new) {
      return 'Nuevo Usuario';
    } else if (userAction === Actions.edit) {
      return 'Editar Usuario';
    }
    return 'Duplicar';
  }, [userAction]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...userData },
    onSubmit: (values, { resetForm }) => {
      console.error(values, userData);
      handleSubmission(values, resetForm);
    },
    validationSchema: Yup.object().shape(userAction === Actions.new ? UserSchema : UserSchemaNoPassword)
  });
  return loading ? (
    <CircularProgress />
  ) : (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <Header>
          <Typography variant="h6" gutterBottom>
            {getLabel()}
          </Typography>
          <AvatarProfile src={formik.values.photoURL} />
        </Header>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField required id="firstName" name="firstName" label="Nombre" fullWidth onChange={formik.handleChange} value={formik.values.firstName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="lastName" name="lastName" label="Apollido" fullWidth onChange={formik.handleChange} value={formik.values.lastName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="email" name="email" label="Correo" fullWidth autoComplete="new-password" onChange={formik.handleChange} value={formik.values.email} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="password"
              disabled={userAction === Actions.edit}
              required={userAction !== Actions.edit}
              id="password"
              name="password"
              label="Clave"
              fullWidth
              autoComplete="new-password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField required id="phone" name="phone" label="Teléfono" fullWidth onChange={formik.handleChange} value={formik.values.phone} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField required id="sellerCode" name="sellerCode" label="Código" fullWidth onChange={formik.handleChange} value={formik.values.sellerCode} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField type="number" required id="warehouse" name="warehouse" label="No. Almacén" fullWidth onChange={formik.handleChange} value={formik.values.warehouse} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSelect required name="type" label="Tipo Usuario" options={userType} handleChange={formik.handleChange} defaultValue={formik.values.type} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomSelect required name="userLevel" label="Nivel de Usuario" options={userRole} handleChange={formik.handleChange} defaultValue={formik.values.userLevel} />
          </Grid>
          <SwitchConfig formik={formik} />
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox color="secondary" name="saveAddress" value="yes" />} label="Use this address for payment details" />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          {getLabel()}
        </Button>
      </form>
    </Wrapper>
  );
};

export default UserForm;
