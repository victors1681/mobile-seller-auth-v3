import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import { useHistory } from 'react-router-dom';
import { useMainApp, UserTypeEnum } from 'hooks';

export const MainListItems = () => {
  const history = useHistory();
  const goTo = (to) => history.push(to);
  const { currentUser } = useMainApp();

  return (
    <div>
      <ListItem button onClick={() => goTo('/main')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      {currentUser?.type === UserTypeEnum.superuser && (
        <ListItem button onClick={() => goTo('/business')}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Negocios" />
        </ListItem>
      )}
      <ListItem button onClick={() => goTo(`/users/`)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Usuarios" />
      </ListItem>
    </div>
  );
};
