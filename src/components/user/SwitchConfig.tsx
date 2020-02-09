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
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import Grid from '@material-ui/core/Grid';
import { FormikValues } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

export default function SwitchConfig({ formik }: { formik: FormikValues }) {
  const classes = useStyles();

  const getToggleValues = () =>
    Object.keys(formik.values).reduce((acc, currentKey) => {
      if (typeof formik.values[currentKey] === 'boolean') {
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

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6}>
        <List subheader={<ListSubheader>Settings</ListSubheader>} className={classes.root}>
          <ListItem>
            <ListItemIcon>
              <WifiIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" primary="firstTimeLogin" />
            <ListItemSecondaryAction>
              <Switch name="firstTimeLogin" onChange={handleToggle('firstTimeLogin')} checked={checked.indexOf('firstTimeLogin') !== -1} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
            <ListItemSecondaryAction>
              <Switch edge="end" onChange={handleToggle('bluetooth')} checked={checked.indexOf('bluetooth') !== -1} inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={6}>
        <List subheader={<ListSubheader>Settings</ListSubheader>} className={classes.root}>
          <ListItem>
            <ListItemIcon>
              <WifiIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
            <ListItemSecondaryAction>
              <Switch edge="end" onChange={handleToggle('wifi2')} checked={checked.indexOf('wifi2') !== -1} inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
            <ListItemSecondaryAction>
              <Switch edge="end" onChange={handleToggle('bluetooth2')} checked={checked.indexOf('bluetooth2') !== -1} inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Grid>
    </React.Fragment>
  );
}
