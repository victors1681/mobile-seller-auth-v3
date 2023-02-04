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
    note: 'Permite al vendedor editar los precios manualmente en el input',
    icon: 'WifiIcon'
  },
  {
    name: 'priceCondition',
    label: 'Condición de precio',
    value: false,
    note: 'Habilitar condición de precios, seleccionando el precio proveniente de ws_clientes CondicionPrecio y desactiva el selector de los precios por debajo',
    icon: 'WifiIcon'
  },
  {
    name: 'selectHighestPrice',
    label: 'Seleccionar precio mayor',
    value: false,
    note: 'Si la condición de precio está activada, en vez de seleccionar el precio de la condición por defecto el iPad seleccionará el precio más alto',
    icon: 'WifiIcon'
  },
  {
    name: 'allowPriceLessMinimum',
    label: 'Permitir precio menor al minimo',
    value: false,
    note: 'Cuando esta opción está activa permitirá al vendedor registrar precio por debajo del precio mínimo precio (5), debe activar la opción (Editar Precio)',
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
    note: 'Forza al vendedor a actualizar la clave',
    icon: 'WifiIcon'
  },
  {
    name: 'initialConfig',
    label: 'Configuración Inicial',
    value: true,
    note: 'Al iniciar sesión por primera vez esta opción permite que el vendedor, cambie la clave, actualice su imagen de perfil y tutorial',
    icon: 'WifiIcon'
  },
  {
    name: 'onlyMyClients',
    label: 'Filtrar Clientes',
    value: false,
    note: 'Filtra sólo los clientes del vendedor',
    icon: 'WifiIcon'
  },
  {
    name: 'onlyProductsSelected',
    label: 'Filtrar Productos',
    value: false,
    note: 'Filtra solo los productos disponible para venta',
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
    label: 'Actualizar Lista de Bancos.',
    value: true,
    note: 'Forza el ipad a actualizar la lista de bancos, Si configuración inicial es activada esta opción no se podrá usar, los bancos son actualizados al inicio',
    icon: 'WifiIcon'
  },
  {
    name: 'forceUpdateProduct',
    label: 'Actualización diaria de productos',
    value: true,
    note: 'Los vendedores deberán actualizar los productos diariamente para poder iniciar con la creación de pedidos.',
    icon: 'WifiIcon'
  },
  {
    name: 'createClient',
    label: 'Crear Clientes',
    value: false,
    note: 'Permite al vendedor crear nuevo cliente y usarlo para facturar.',
    icon: 'WifiIcon'
  },
  {
    name: 'allowDiscount',
    label: 'Permitir Descuento en Cobro',
    value: true,
    note: 'Permite al vendedor aplicar descuento al cobrar una factura',
    icon: 'WifiIcon'
  },
  {
    name: 'allowBankDeposit',
    label: 'Permitir Depositar Cobros en el banco',
    value: true,
    note: 'Permite al vendedor depositar cobros directamente en el banco y enviar el comporbante de deposito',
    icon: 'WifiIcon'
  },
  {
    name: 'allowChat',
    label: 'Sistema de Mensajería (Chat)',
    value: true,
    note: 'Permite a los vendedores enviar mensajes entre ellos, por medio de chat.',
    icon: 'WifiIcon'
  },
  {
    name: 'demoMode',
    label: 'Usuario tipo demo',
    value: true,
    note: 'Usuario con los privilegios limitados y auto desactivado.',
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
    const totalItems = Math.floor(fields.length / 2);
    const fieldSelected = column === 0 ? fields.slice(0, totalItems) : fields.slice(totalItems, fields.length);

    return fieldSelected.map((field) => (
      <ListItem key={field.name}>
        <FormControlLabel
          control={
            <Tooltip title={field.note} aria-label={field.note}>
              <Switch name={field.name} onChange={handleToggle(field.name)} checked={checked.indexOf(field.name) !== -1} />
            </Tooltip>
          }
          label={field.label}
        />
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
