import { Grid, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

import { InputText, SwitchInput } from 'common/form/inputs';
import { Field, useFormikContext } from 'formik';

export const Whatsapp = () => {
  const { values, setFieldValue } = useFormikContext<IBusiness>();

  React.useEffect(() => {
    setFieldValue('config.integrations[0].provider', 'whatsapp');
  }, [values.config]);

  const whatsappIntegration = values.config.integrations && values.config.integrations[0] && values.config.integrations[0];
  const isDevelopment = whatsappIntegration?.isDevelopment;
  const isEnabled = whatsappIntegration?.enabled;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <ListItem>
            <ListItemText secondary="WhatsApp" />
          </ListItem>
        </Grid>
      </Grid>

      <Grid container spacing={1} style={{ marginLeft: '10px', marginRight: '10px' }}>
        <Grid item xs={12} sm={12}>
          <SwitchInput label="Activado" name="config.integrations[0].enabled" />
        </Grid>

        {isEnabled && (
          <>
            <Field type="hidden" value="whatsapp" name="config.integrations[0].provider" />
            <Grid item xs={6} sm={6}>
              <InputText name="config.integrations[0].token" label="Access Token" />
            </Grid>
            <Grid item xs={6} sm={6}>
              <InputText name="config.integrations[0].phoneNumberId" label="Phone Number ID" />
            </Grid>
            <Grid item xs={12} sm={12}>
              <SwitchInput label="Desarrollador" tooltip="Modo desarrollador" name="config.integrations[0].isDevelopment" />
            </Grid>
            {isDevelopment && (
              <>
                <Grid item xs={6} sm={6}>
                  <InputText name="config.integrations[0].devToken" label="Development Access Token" />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <InputText name="config.integrations[0].devPhoneNumberId" label="Development Phone Number ID" />
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default Whatsapp;
