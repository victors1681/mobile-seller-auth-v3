import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';

import { Paper, Avatar, Switch, ListItem, FormControlLabel, ListItemText, Divider, Link, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { FieldArray, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { useMainApp } from 'hooks';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import { Loader, InputText } from 'common';
import { Integrations } from './integrations';

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
    serverPort: Yup.number().required('Requerido'),
    orderEmailTemplateID: Yup.number(),
    paymentEmailTemplateID: Yup.number(),
    metadata: Yup.array().of(
      Yup.object().shape({
        key: Yup.string()
          .required('Key requerida')
          .trim('No se permiten espacios en blanco'),
        value: Yup.string()
          .required('Valor requerida')
          .trim('No se permiten espacios en blanco')
      })
    )
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
    testMode: false,
    displayPriceWithTax: false,
    allowPriceBelowMinimum: false,
    allowOrderAboveCreditLimit: false,
    allowLoadLastOrders: false,
    allowLoadLastPrices: false,
    showProducInfoPanel: false,
    temporalOrder: false,
    orderEmailTemplateID: '',
    paymentEmailTemplateID: '',
    allowQuote: false,
    trackingLocation: false,
    integrations: [],
    metadata: []
  },
  status: true,
  sellingPackaging: false
};

interface MetadataProp {
  values: IBusiness;
}

const Metadata = ({ values }: MetadataProp) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <ListItem>
          <ListItemText primary="Configuraciones Especiales" />
        </ListItem>
        <Divider component="div" />
      </Grid>
      <FieldArray name="config.metadata">
        {({ remove, push }) => (
          <>
            {values.config &&
              values.config.metadata &&
              values.config.metadata.length > 0 &&
              values.config.metadata.map((_, index) => {
                return (
                  <Grid container spacing={3} key={index}>
                    <Grid item xs={5} sm={5}>
                      <ListItem>
                        <InputText name={`config.metadata.${index}.key`} label="Key" />
                      </ListItem>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                      <ListItem>
                        <InputText name={`config.metadata.${index}.value`} label="Value" />
                      </ListItem>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <ListItem>
                        <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => remove(index)}>
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    </Grid>
                  </Grid>
                );
              })}
            <Grid item xs={12} sm={12}>
              <ListItem>
                <Button fullWidth color="primary" variant="outlined" onClick={() => push({ key: '', value: '' })}>
                  Agregar Metadata
                </Button>
              </ListItem>
            </Grid>
          </>
        )}
      </FieldArray>
    </Grid>
  );
};

export const UserForm = () => {
  const [businessData, setBusinessData] = React.useState((formInit as unknown) as IBusiness);
  const [userAction, setUserAction] = React.useState<Actions>(Actions.new);

  const history = useHistory();
  const { businessId } = useParams<any>();
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
      handleSubmission(values, resetForm);
    },
    validationSchema: Yup.object().shape(BusinessSchema)
  });

  const handleDuplication = React.useCallback(() => {
    history.push(`/user/edit/${businessId}/${businessId}/true`);
  }, [businessId, businessId]);

  return (
    <Wrapper>
      <FormikProvider value={formik}>
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
              <TextField id="logoUrl" name="logoUrl" label="Logo Url" fullWidth onChange={formik.handleChange} value={formik.values.logoUrl} />
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

            <Grid item xs={12} sm={12}>
              <ListItem>
                <ListItemText primary="Email Template" />
              </ListItem>
              <Divider component="div" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                id="orderEmailTemplateID"
                name="config.orderEmailTemplateID"
                label="ID email template pedido"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.config.orderEmailTemplateID}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                id="paymentEmailTemplateID"
                name="config.paymentEmailTemplateID"
                label="ID email template cobros"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.config.paymentEmailTemplateID}
              />
            </Grid>
            <Link target="_blank" href="https://app.mailjet.com/dashboard" style={{ paddingLeft: '11px' }}>
              Configurar Email Template
            </Link>

            <Grid item xs={12} sm={12} />
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel control={<Switch name="config.testMode" onChange={formik.handleChange} checked={!!formik.values.config.testMode} />} label="Modo de prueba" />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.displayPriceWithTax" onChange={formik.handleChange} checked={!!formik.values.config.displayPriceWithTax} />}
                  label="Muestra Precio con impuesto"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.allowPriceBelowMinimum" onChange={formik.handleChange} checked={!!formik.values.config.allowPriceBelowMinimum} />}
                  label="Permitir precio por debajo del mínimo"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.allowOrderAboveCreditLimit" onChange={formik.handleChange} checked={!!formik.values.config.allowOrderAboveCreditLimit} />}
                  label="Permitir realizar pedido por arriba del límite de crédito"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.allowLoadLastOrders" onChange={formik.handleChange} checked={!!formik.values.config.allowLoadLastOrders} />}
                  label="Permite cargar últimos documentos"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.allowLoadLastPrices" onChange={formik.handleChange} checked={!!formik.values.config.allowLoadLastPrices} />}
                  label="Permitir cargar los precios anteriores"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.showProducInfoPanel" onChange={formik.handleChange} checked={!!formik.values.config.showProducInfoPanel} />}
                  label="Mostrar panel en producto, para calcular la diferencia de la condiciones de precios"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.captureTemporalDoc" onChange={formik.handleChange} checked={!!formik.values.config.captureTemporalDoc} />}
                  label="Capturar documento temporal"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel control={<Switch name="sellingPackaging" onChange={formik.handleChange} checked={!!formik.values.sellingPackaging} />} label="Compra Empase UI" />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel control={<Switch name="status" onChange={formik.handleChange} checked={!!formik.values.status} />} label="Status" />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel control={<Switch name="config.allowQuote" onChange={formik.handleChange} checked={!!formik.values.config.allowQuote} />} label="Permitir crear cotizaciones" />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.trackingLocation" onChange={formik.handleChange} checked={!!formik.values.config.trackingLocation} />}
                  label="Reastreo en tiempo real"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.v4" onChange={formik.handleChange} checked={!!formik.values.config.v4} />}
                  label="MSeller V4"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.promocion" onChange={formik.handleChange} checked={!!formik.values.config.promocion} />}
                  label="Permite agregar artículos promoción sin costo"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.proximaOrden" onChange={formik.handleChange} checked={!!formik.values.config.proximaOrden} />}
                  label="Artículos para próxima orden"
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <FormControlLabel
                  control={<Switch name="config.enableConfirmSelector" onChange={formik.handleChange} checked={!!formik.values.config.enableConfirmSelector} />}
                  label="Activar selector de clientes confirmados/no confirmados"
                />
              </ListItem>
            </Grid>
          </Grid>

          <Integrations />
          <Metadata values={formik.values} />

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
      </FormikProvider>
    </Wrapper>
  );
};

export default UserForm;
