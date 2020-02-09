import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
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
const fields: Field[] = [
  {
    name: 'editPrice',
    label: 'Editar Precio',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'filterClients',
    label: 'Filtrar Cliente',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'firstTimeLogin',
    label: 'Primer inicio de sesión',
    value: false,
    note: '',
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
    value: false,
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
    label: 'Resetear iPad',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'restoreIpad',
    label: 'Restaurar Ipad',
    value: false,
    note: '',
    icon: 'WifiIcon'
  },
  {
    name: 'testMode',
    label: 'Modo de Prueba',
    value: false,
    note: '',
    icon: 'WifiIcon'
  }
];

export default function SwitchConfig({ formik }: { formik: FormikValues }) {
  const classes = useStyles();

  const getToggleValues = () =>
    Object.keys(formik.values).reduce((acc, currentKey) => {
      if (typeof formik.values[currentKey] === 'boolean' && formik.values[currentKey]) {
        return [...acc, currentKey];
      }
      return acc;
    }, []);

  const [checked, setChecked] = React.useState(getToggleValues());

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    formik.setFieldValue(value, newChecked.includes(value));
    setChecked(newChecked);
  };

  enum Column {
    first,
    second
  }

  const renderSwitch = (column: Column) => {
    const totalItems = fields.length / 2;
    const fieldSelected = column === 0 ? fields.slice(0, totalItems) : fields.slice(totalItems + 1, fields.length);

    return fieldSelected.map((field) => (
      <ListItem key={field.name}>
        <ListItemIcon>
          <WifiIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-wifi" primary={field.label} />
        <ListItemSecondaryAction>
          <Switch name={field.name} onChange={handleToggle(field.name)} checked={checked.indexOf(field.name) !== -1} />
        </ListItemSecondaryAction>
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
