import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import { TransferUser } from 'components/user';

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2)
  }
}));

const CustomToolbar = ({ location }: { location: string }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const history = useHistory();

  const handleClick = React.useCallback(() => {
    history.push(location);
  }, [location]);

  const classes = useStyles();

  return (
    <React.Fragment>
      <TransferUser open={open} handleClose={handleClose} />
      <Tooltip title="Transferir usuarios">
        <Fab className={classes.fab} onClick={handleClickOpen} size="small">
          <SyncAltIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Crear nuevo">
        <Fab color="primary" className={classes.fab} onClick={handleClick} size="small">
          <AddIcon />
        </Fab>
      </Tooltip>
    </React.Fragment>
  );
};

export default CustomToolbar;
