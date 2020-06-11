import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Email } from '@material-ui/icons';
import { useMainApp } from 'hooks';

interface ISendPasswordReset {
  email: string;
}
export function SendPasswordReset({ email }: ISendPasswordReset) {
  const [open, setOpen] = React.useState(false);

  const {
    userHook: { sendEmailToResetPassword }
  } = useMainApp();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendEmail = React.useCallback(async () => {
    const response = await sendEmailToResetPassword(email);
    if (response) {
      handleClose();
    }
  }, [email]);

  return (
    <div>
      <Tooltip title="Enviar email al usuario para restaurar la contraseña" onClick={handleClickOpen} color="primary">
        <IconButton aria-label="send email">
          <Email />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Reestablecer Contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Seguro que deseas generar un email a {email} para que este usuario cambie su contraseña?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSendEmail} color="primary" autoFocus variant="contained">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SendPasswordReset;
