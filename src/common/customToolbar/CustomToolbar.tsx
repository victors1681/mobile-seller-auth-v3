import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2)
  }
}));

const CustomToolbar = ({ location }: { location: string }) => {
  const history = useHistory();

  const handleClick = React.useCallback(() => {
    history.push(location);
  }, [location]);

  const classes = useStyles();

  return (
    <React.Fragment>
      <Tooltip title="Crear nuevo">
        <Fab color="primary" className={classes.fab} onClick={handleClick} size="small">
          <AddIcon />
        </Fab>
      </Tooltip>
    </React.Fragment>
  );
};

export default CustomToolbar;
