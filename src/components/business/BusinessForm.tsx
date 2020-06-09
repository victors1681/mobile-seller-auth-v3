import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Paper, Avatar, Switch, ListItem, FormControlLabel, ListItemText, Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { useMainApp } from 'hooks';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import { Loader } from 'common';

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

const BusinessSchema = {
  name: Yup.string().required('Requerido'),
  contact: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido'),
  sellerLicenses: Yup.string().required('Requerido'),
  config: Yup.object().shape({
    serverUrl: Yup.string().required('Requerido'),
    serverPort: Yup.number().required('Requerido')
  })
};

enum Actions {
  new = 'new',
  edit = 'edit'
}

const formInit = {
  name: '',
  rnc: '',
  phone: '',
  email: '',
  photoURL: '',
  business: '',
  logoUrl: '',
  footerMessage: '',
  footerReceipt: '',
  sellerLicenses: 0,
  contact: '',
  contactPhone: '',
  fax: '',
  website: '',
  address: {
    street: '',
    city: '',
    country: ''
  },
  config: {
    serverUrl: '',
    serverPort: '',
    sandboxUrl: '',
    sandboxPort: '',
    testMode: false
  },
  status: true,
  sellingPackaging: false
};

export const UserForm = () => {
  const [businessData, setBusinessData] = React.useState((formInit as unknown) as IBusiness);
  const [userAction, setUserAction] = React.useState<Actions>(Actions.new);

  const history = useHistory();
  const { businessId } = useParams();
  const {
    businessHook: { isLoading, addBusiness, updateBusiness, requestBusinessById }
  } = useMainApp();

  const getBusinessData = React.useCallback(async () => {
    if (businessId) {
      const response = await requestBusinessById(businessId);
      if (response) {
        setBusinessData((response as unknown) as IBusiness);
      }
    }
  }, [businessId]);

  React.useEffect(() => {
    if (businessId !== Actions.new) {
      setUserAction(Actions.edit);
      getBusinessData();
    }
  }, [getBusinessData, businessId]);

  const handleSubmission = React.useCallback(
    async (values: IBusiness, resetForm: any) => {
      if (userAction === Actions.edit && businessId) {
        await updateBusiness(values, businessId);
        history.goBack();
      } else {
        //new or duplicate add new user
        const isCreated = await addBusiness(values);
        if (isCreated) {
          //reset form
          resetForm();
        }
      }
    },
    [businessId, userAction, history]
  );

  const getLabel = React.useCallback(() => {
    if (userAction === Actions.new) {
      return 'Nueva Empresa';
    }

    return 'Editar Empresa';
  }, [userAction]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...businessData },
    onSubmit: (values, { resetForm }) => {
      console.error(values, businessData);
      handleSubmission(values, resetForm);
    },
    validationSchema: Yup.object().shape(BusinessSchema)
  });

  const handleDuplication = React.useCallback(() => {
    history.push(`/user/edit/${businessId}/${businessId}/true`);
  }, [businessId, businessId]);

  return (
    <Wrapper>
      <Loader isLoading={isLoading} />
      <form onSubmit={formik.handleSubmit}>
        <Header>
          <Typography variant="h6" gutterBottom>
            {getLabel()}
          </Typography>
          <AvatarProfile src={formik.values.logoUrl} />
        </Header>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <ListItem>
              <ListItemText primary="Infomaciones" />
            </ListItem>
            <Divider component="div" />
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField required id="name" name="name" label="Nombre" fullWidth onChange={formik.handleChange} value={formik.values.name} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField id="rnc" name="rnc" label="RNC" fullWidth onChange={formik.handleChange} value={formik.values.rnc} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField type="number" required id="sellerLicenses" name="sellerLicenses" label="Licencias" fullWidth onChange={formik.handleChange} value={formik.values.sellerLicenses} />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField id="phone" name="phone" label="Teléfono" fullWidth onChange={formik.handleChange} value={formik.values.phone} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField id="fax" name="fax" label="Fax" fullWidth onChange={formik.handleChange} value={formik.values.fax} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField id="email" name="email" label="Email" fullWidth onChange={formik.handleChange} value={formik.values.email} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField id="website" name="website" label="Página web" fullWidth onChange={formik.handleChange} value={formik.values.website} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <ListItem>
              <ListItemText primary="Contactos" />
            </ListItem>
            <Divider component="div" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField required id="contact" name="contact" label="Contácto" fullWidth onChange={formik.handleChange} value={formik.values.contact} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="contactPhone" name="contactPhone" label="Teléfono Contácto" fullWidth onChange={formik.handleChange} value={formik.values.contactPhone} />
          </Grid>

          <Grid item xs={12} sm={12}>
            <ListItem>
              <ListItemText primary="Dirección" />
            </ListItem>
            <Divider component="div" />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField id="address.street" name="address.street" label="Calle" fullWidth onChange={formik.handleChange} value={formik.values.address.street} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="address.city" name="address.city" label="Ciudad" fullWidth onChange={formik.handleChange} value={formik.values.address.city} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="address.country" name="address.country" label="País" fullWidth onChange={formik.handleChange} value={formik.values.address.country} />
          </Grid>

          <Grid item xs={12} sm={12}>
            <ListItem>
              <ListItemText primary="Configuraciones" />
            </ListItem>
            <Divider component="div" />
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField required id="config.serverUrl" name="config.serverUrl" label="Url Servidor" fullWidth onChange={formik.handleChange} value={formik.values.config.serverUrl} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField required type="number" id="config.serverPort" name="config.serverPort" label="Puerto" fullWidth onChange={formik.handleChange} value={formik.values.config.serverPort} />
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField id="config.sandboxUrl" name="config.sandboxUrl" label="Url Servidor Prueba" fullWidth onChange={formik.handleChange} value={formik.values.config.sandboxUrl} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField type="number" id="config.sandboxPort" name="config.sandboxPort" label="Puerto Prueba" fullWidth onChange={formik.handleChange} value={formik.values.config.sandboxPort} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField type="textarea" id="footerMessage" name="footerMessage" label="Mensaje pie factura" fullWidth onChange={formik.handleChange} value={formik.values.footerMessage} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField type="textarea" id="footerReceipt" name="footerReceipt" label="Mensaje pie recibo" fullWidth onChange={formik.handleChange} value={formik.values.footerReceipt} />
          </Grid>

          <Grid item xs={12} sm={12} />
          <Grid item xs={12} sm={4}>
            <ListItem>
              <FormControlLabel control={<Switch name="config.testMode" onChange={formik.handleChange} checked={formik.values.config.testMode} />} label="Modo de prueba" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ListItem>
              <FormControlLabel control={<Switch name="sellingPackaging" onChange={formik.handleChange} checked={formik.values.sellingPackaging} />} label="Compra Empase UI" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ListItem>
              <FormControlLabel control={<Switch name="status" onChange={formik.handleChange} checked={formik.values.status} />} label="Status" />
            </ListItem>
          </Grid>
        </Grid>

        <Grid container spacing={6}>
          <Grid item xs={12} sm={3}>
            {userAction === Actions.edit && (
              <Tooltip title="Crea un nuevo usuario utilizando las configuraciones de este usuario" aria-label="">
                <Button fullWidth color="primary" onClick={handleDuplication} variant="outlined">
                  Duplicar Empresa
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
