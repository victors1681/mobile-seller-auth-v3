import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { FormikValues } from 'formik';
import { UserTypeEnum } from 'root/hooks/useUser';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  accordionRoot: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  accordionSummary: {
    alignItems: 'center'
  }
}));

export interface Field {
  name: string;
  label: string;
  value: boolean;
  note: string;
  userType?: UserTypeEnum;
  icon: string;
}

export const cloudModules = [
  {
    name: 'orders',
    label: 'Ordenes',
    description: 'Módulo de pedidos y ventas',
    visible: true,
    access: [
      {
        name: 'allowApprove',
        label: 'Aprobar Orden',
        value: false,
        note: 'Permite al usuario ver las estadisticas de ventas.',
        icon: 'WifiIcon'
      },
      {
        name: 'allowEdit',
        label: 'Permitir Editar',
        value: false,
        note: 'Permite al usuario ver las estadisticas de ventas.',
        icon: 'WifiIcon'
      }
    ]
  },
  {
    name: 'transports',
    label: 'Transporte',
    description: 'Módulo de transporte y distribución',
    visible: true,
    access: [
      {
        name: 'allowForceClose',
        label: 'Cerrar Transporte',
        value: false,
        note: 'Permite al usuario ver las estadisticas de ventas.',
        icon: 'WifiIcon'
      },
      {
        name: 'allowChangeStatus',
        label: 'Cambiar Estado',
        value: false,
        note: 'Permite al usuario ver las estadisticas de ventas.',
        icon: 'WifiIcon'
      }
    ]
  },
  {
    name: 'collections',
    label: 'Cobranzas',
    description: 'Recepción de cobros',
    visible: true,
    access: []
  },
  {
    name: 'visits',
    label: 'Visitas',
    description: 'Recepción de todas las visitas',
    visible: true,
    access: []
  },
  {
    name: 'masterdata',
    label: 'Data Maestra',
    description: 'Clientes, Productos, Vendedores etc.',
    visible: true,
    access: []
  },
  {
    name: 'statistics',
    label: 'Estadisticas',
    description: 'Módulo de estadisticas de ventas',
    visible: true,
    access: []
  },
  {
    name: 'settings',
    label: 'Configuración',
    description: 'Configuraciones de la aplicación',
    visible: true,
    access: []
  }
];

export default function CloudSwitchConfig({ formik }: { formik: FormikValues }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [checked, setChecked] = React.useState<any>([]);

  const handleToggle = React.useCallback(
    (value: any) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      formik.setFieldValue(value, newChecked.includes(value));
      setChecked(newChecked);
    },
    [checked]
  );

  const accessLevelObj = 'cloudAccess';

  return (
    <div className={classes.accordionRoot}>
      <ListSubheader>Permisos MSeller Cloud</ListSubheader>
      {cloudModules.map((module) => {
        return (
          <Accordion key={module.name} expanded={expanded === module.name} onChange={handleChange(module.name)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${module.name}-content`} id={`panel${module.name}-header`}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  aria-label="Acknowledge"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    <Switch
                      name={`${accessLevelObj}.${module.name}.enabled`}
                      onChange={handleToggle(`${accessLevelObj}.${module.name}.enabled`)}
                      checked={!!formik.values?.[accessLevelObj]?.[module.name]?.['enabled']}
                    />
                  }
                  label={module.label}
                />

                <Typography className={classes.secondaryHeading}>{module.description}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                {module.access.map((access) => (
                  <Grid item xs={6} key={access.name}>
                    <ListItem>
                      <FormControlLabel
                        disabled={!formik.values?.[`${accessLevelObj}`]?.[module.name]}
                        control={
                          <Tooltip title={access.note} aria-label={access.note}>
                            <Switch
                              name={`${accessLevelObj}.${module.name}.${access.name}`}
                              onChange={handleToggle(`${accessLevelObj}.${module.name}.${access.name}`)}
                              checked={!!formik.values?.[accessLevelObj]?.[module.name]?.[access.name]}
                            />
                          </Tooltip>
                        }
                        label={access.label}
                      />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
