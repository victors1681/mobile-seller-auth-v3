import { Button, Divider, Grid, ListItem, ListItemText } from '@material-ui/core';
import { FieldArray, useField, useFormikContext } from 'formik';
import React from 'react';
import { WhatsApp } from '@material-ui/icons';
import { Whatsapp } from './whatsapp';

export const Integrations = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <ListItem>
          <ListItemText primary="Integraciones" />
        </ListItem>
        <Divider component="div" />
      </Grid>
      <Whatsapp />
    </Grid>
  );
};
