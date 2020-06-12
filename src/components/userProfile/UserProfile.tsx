import React from 'react';
import { Badge, Popper, Avatar, MenuList, ClickAwayListener, MenuItem, Grow, Paper } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useMainApp } from 'hooks';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export function UserProfile() {
  const classes = useStyles();

  const { currentUser, logOut } = useMainApp();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<any>();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef?.current?.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogOut = (e) => {
    handleClose(e);
    logOut();
  };

  return (
    <div className={classes.root}>
      <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        variant="dot"
      >
        <Avatar component="a" alt="Remy Sharp" src={currentUser?.photoURL} ref={anchorRef} onClick={handleToggle} />
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </StyledBadge>
    </div>
  );
}

export default UserProfile;
