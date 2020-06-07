import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Paper, CircularProgress, Avatar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { useMainApp } from 'hooks';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Tooltip from '@material-ui/core/Tooltip';
import { CustomSelect } from 'common';
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

  const history = useHistory();
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
  }, [userId, duplicate]);

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
  }, [getUserData, userId, duplicate]);

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

  const handleDuplication = React.useCallback(() => {
    history.push(`/user/edit/${userId}/${businessId}/true`);
  }, [userId, businessId]);

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
            <TextField required id="lastName" name="lastName" label="Apellido" fullWidth onChange={formik.handleChange} value={formik.values.lastName} />
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
        </Grid>

        <Grid container spacing={6}>
          <Grid item xs={12} sm={3}>
            {userAction === Actions.edit && (
              <Tooltip title="Crea un nuevo usuario utilizando las configuraciones de este usuario" aria-label="">
                <Button fullWidth color="primary" onClick={handleDuplication} variant="outlined">
                  Duplicar Usuario
                </Button>
              </Tooltip>
            )}
          </Grid>
          <Grid item xs={12} sm={3} />
          <Grid item xs={12} sm={3} />
          <Grid item xs={12} sm={3}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {getLabel()}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Wrapper>
  );
};

export default UserForm;
