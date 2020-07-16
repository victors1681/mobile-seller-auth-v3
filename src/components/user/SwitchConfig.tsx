import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { FormikValues } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

export interface Field {
  name: string;
  label: string;
  value: boolean;
  note: string;
  icon: string;
}
export const fields: Field[] = [
  {
    name: 'editPrice',
    label: 'Editar Precio',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'firstTimeLogin',
    label: 'Primer inicio de sesión',
    value: false,
    note: 'Opción no disponible. no utilizada',
    icon: 'WifiIcon'
  },
  {
    name: 'forceUpdatePassword',
    label: 'Forzar contraseña',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'initialConfig',
    label: 'Configuración Inicial',
    value: true,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'onlyMyClients',
    label: 'Filtrar Clientes',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'onlyProductsSelected',
    label: 'Filtrar Productos',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'priceCondition',
    label: 'Condición de precio',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'resetIpad',
    label: 'Resetear iPad (No recomendada)',
    value: false,
    note:
      'Esta opción permite que el ipad sea reseteada, esta opción solo debe usarse si el código de vendedor es nuevo nunca antes usada. si existe esto causará conflicto con los pedidos previamente registrado por el vendedor.',
    icon: 'WifiIcon'
  },
  {
    name: 'restoreIpad',
    label: 'Restaurar Ipad (Recomendable)',
    value: false,
    note: 'Esta opción resetea el ipad luego sincroniza las informaciones de pedidos y cobros con el servidor si existe.',
    icon: 'WifiIcon'
  },
  {
    name: 'testMode',
    label: 'Modo de Prueba',
    value: false,
    note: 'Activa modo de pueba, las informaciones capturadas no serán procesadas',
    icon: 'WifiIcon'
  },
  {
    name: 'defaultClientByRoute',
    label: 'Mostrar Clientes por Ruta',
    value: true,
    note: 'Muestra los clientes por ruta por defecto',
    icon: 'WifiIcon'
  },
  {
    name: 'updateBankList',
    label: 'Actualizar Lista de Bancos',
    value: true,
    note: 'Forza el ipad a actualizar la lista de bancos',
    icon: 'WifiIcon'
  }
];

export default function SwitchConfig({ formik }: { formik: FormikValues }) {
  const classes = useStyles();

  const getToggleValues = () =>
    Object.keys(formik.values).reduce((acc: any, currentKey: any) => {
      if (typeof formik.values[currentKey] === 'boolean' && formik.values[currentKey]) {
        return [...acc, currentKey];
      }
      return acc;
    }, []);

  const [checked, setChecked] = React.useState(getToggleValues() || []);

  const handleToggle = React.useCallback(
    (value) => () => {
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

  enum Column {
    first,
    second
  }

  const renderSwitch = (column: Column) => {
    const totalItems = fields.length / 2;
    const fieldSelected = column === 0 ? fields.slice(0, totalItems) : fields.slice(totalItems + 1, fields.length);

    return fieldSelected.map((field) => (
      <ListItem key={field.name}>
        <FormControlLabel control={<Switch name={field.name} onChange={handleToggle(field.name)} checked={checked.indexOf(field.name) !== -1} />} label={field.label} />
      </ListItem>
    ));
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6}>
        <List subheader={<ListSubheader>Configuraciones</ListSubheader>} className={classes.root}>
          {renderSwitch(Column.first)}
        </List>
      </Grid>
      <Grid item xs={12} sm={6}>
        <List subheader={<ListSubheader> _ </ListSubheader>} className={classes.root}>
          {renderSwitch(Column.second)}
        </List>
      </Grid>
    </React.Fragment>
  );
}
