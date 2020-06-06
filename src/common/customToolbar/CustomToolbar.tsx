import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  iconButton: {}
});

const CustomToolbar = ({ location }: { location: string }) => {
  const history = useHistory();

  const handleClick = () => {
    console.log('clicked on icon!');
    history.push(location);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <Tooltip title="custom icon">
        <IconButton size="medium" color="primary" className={classes.iconButton} onClick={handleClick}>
          <AddIcon color="primary" />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default CustomToolbar;
