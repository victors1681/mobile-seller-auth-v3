import * as React from 'react';
import { Checkbox, Button, Paper, Avatar, TextField, Typography, Grid, FormControlLabel, IconButton } from '@material-ui/core';
import { Delete, FileCopy } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { useMainApp } from 'hooks';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Tooltip from '@material-ui/core/Tooltip';
import { CustomSelect, Loader, AlertDialog } from 'common';
import SwitchConfig, { fields as defaultFieldValues } from './SwitchConfig';
import { ChangePassword, SendPasswordReset } from './changePassword';

const AvatarProfile = styled(Avatar)`
  width: ${({ theme }) => theme.spacing(7)};
  height: ${({ theme }) => theme.spacing(7)};
`;

const PrimaryTopWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-bottom: 19px;
  justify-content: flex-end;
`;

const PasswordResetWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Wrapper = styled.div`
  padding: 19px;
`;
const FormInnerWrapper = styled(Paper)`
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
  password: Yup.string()
    .min(6)
    .required('Requerido')
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

const powerUserTypeList: SelectOptions[] = [
  {
    name: 'seller',
    label: 'Vendedor',
    value: 'seller'
  },
  {
    name: 'administrator',
    label: 'Administrador',
    value: 'administrator'
  },
  {
    name: 'superuser',
    label: 'Super User',
    value: 'superuser'
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
  disabled: false,
  ...defaultFieldValues.reduce((acc, current) => ({ ...acc, [current.name]: current.value }), {})
};

export const UserForm = () => {
  const [userData, setUserData] = React.useState((formInit as unknown) as IUser);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [userAction, setUserAction] = React.useState<Actions>(Actions.new);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const history = useHistory();
  const { userId, businessId, duplicate } = useParams();
  const {
    userHook: { requestUserById, addUser, isSellerCodeExist, updateUser, removeUser },
    currentUser
  } = useMainApp();

  const getUserData = React.useCallback(async () => {
    const result = await requestUserById(userId || '');

    if (duplicate) {
      const user = { ...result, userId: '', email: '', password: '', firstName: '', lastName: '', sellerCode: '', phone: '', photoURL: '', initialConfig: true, updateBankList: true } as IUser;
      setUserData(user);
    } else {
      setUserData(result as IUser);
    }
    setLoading(false);
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
      if (!businessId || businessId === 'undefined') {
        toast.error('Id de la empresa no existe en la url');
        return;
      }

      if (isSellerCodeExist) {
        setLoading(true);
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
        }
      }
      setLoading(false);
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
      handleSubmission(values, resetForm);
    },
    validationSchema: Yup.object().shape(userAction === Actions.new ? UserSchema : UserSchemaNoPassword)
  });

  const handleDuplication = React.useCallback(() => {
    history.push(`/user/edit/${userId}/${businessId}/true`);
  }, [userId, businessId]);

  const handleDeleteAccount = React.useCallback(async () => {
    setLoading(true);
    if (userId) {
      const response = await removeUser(userId);
      if (response) {
        setDeleteConfirmOpen(false);
        setLoading(false);
        history.goBack();
      }
    }
  }, [userId]);

  const handleConfirmationDialog = (state: boolean) => {
    setDeleteConfirmOpen(state);
  };
  return (
    <Wrapper>
      <Loader isLoading={loading} />
      <AlertDialog
        open={deleteConfirmOpen}
        title="Eliminar Usuario"
        content="Seguro que deseas eliminar este usuario?"
        acceptCallback={handleDeleteAccount}
        cancelCallback={() => handleConfirmationDialog(false)}
        acceptTitle="Si"
        cancelTitle="No"
      />
      <form onSubmit={formik.handleSubmit}>
        <PrimaryTopWrapper>
          <Button type="submit" variant="contained" color="primary">
            {getLabel()}
          </Button>
        </PrimaryTopWrapper>
        <FormInnerWrapper>
          <Header>
            <Typography variant="h6" gutterBottom>
              {getLabel()}
            </Typography>
            <AvatarProfile src={formik.values.photoURL} />
          </Header>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="firstName"
                name="firstName"
                label="Nombre"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={!!formik.errors.firstName && formik.touched.firstName}
                helperText={formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Apellido"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={!!formik.errors.lastName && formik.touched.lastName}
                helperText={formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="email"
                name="email"
                label="Correo"
                fullWidth
                autoComplete="new-email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={!!formik.errors.email && formik.touched.email}
                helperText={formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              {userAction === Actions.edit && userId ? (
                <PasswordResetWrapper>
                  <ChangePassword userId={userId} />
                  <SendPasswordReset email={formik.values.email} />
                </PasswordResetWrapper>
              ) : (
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  label="Contraseña"
                  fullWidth
                  error={!!formik.errors.password && formik.touched.password}
                  helperText={formik.errors.password}
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField id="phone" name="phone" label="Teléfono" fullWidth onChange={formik.handleChange} value={formik.values.phone} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                id="sellerCode"
                name="sellerCode"
                label="Código"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.sellerCode}
                error={!!formik.errors.sellerCode && formik.touched.sellerCode}
                helperText={formik.errors.sellerCode}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField type="number" required id="warehouse" name="warehouse" label="No. Almacén" fullWidth onChange={formik.handleChange} value={formik.values.warehouse} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomSelect
                required
                name="type"
                label="Tipo Usuario"
                options={currentUser?.type === 'superuser' ? powerUserTypeList : userType}
                handleChange={formik.handleChange}
                defaultValue={formik.values.type}
                error={!!formik.errors.type && formik.touched.type}
                helperText={formik.errors.type}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomSelect
                required
                name="userLevel"
                label="Nivel de Usuario"
                options={userRole}
                handleChange={formik.handleChange}
                defaultValue={formik.values.userLevel}
                error={!!formik.errors.userLevel && formik.touched.userLevel}
                helperText={formik.errors.userLevel}
              />
            </Grid>
            {!loading && <SwitchConfig formik={formik} />}
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <FormControlLabel control={<Checkbox name="disabled" onChange={formik.handleChange} checked={formik.values.disabled} />} label="Disabled" />
            </Grid>
            <Grid item xs={12} sm={1}>
              {userAction === Actions.edit && (
                <Tooltip title="Eliminar usuario" aria-label="">
                  <IconButton color="secondary" onClick={() => handleConfirmationDialog(true)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={12} sm={1}>
              {userAction === Actions.edit && (
                <Tooltip title="Crea un nuevo usuario utilizando las configuraciones de este usuario" aria-label="">
                  <IconButton color="primary" onClick={handleDuplication}>
                    <FileCopy />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>

            <Grid item xs={12} sm={8} />
            <Grid item xs={12} sm={2}>
              <Button onClick={() => history.goBack()} variant="outlined">
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </FormInnerWrapper>
      </form>
    </Wrapper>
  );
};

export default UserForm;
