import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IAlertDialog {
  open: boolean;
  title: string;
  content: string;
  cancelCallback?: () => {};
  acceptCallback?: () => {};
  cancelTitle?: string;
  acceptTitle?: string;
}
export default function AlertDialog({ open, title, content, cancelCallback, acceptCallback, acceptTitle, cancelTitle }: IAlertDialog) {
  const [innerOpen, setOpen] = React.useState(open);

  React.useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleClose = () => {
    if (cancelCallback && typeof cancelCallback === 'function') {
      cancelCallback();
    }
    setOpen(false);
  };

  const handleAccept = () => {
    if (acceptCallback && typeof acceptCallback === 'function') {
      acceptCallback();
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={innerOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {cancelTitle && (
            <Button onClick={handleClose} color="secondary">
              {cancelTitle}
            </Button>
          )}
          <Button onClick={handleAccept} color="primary" autoFocus>
            {acceptTitle ? acceptTitle : 'ok'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
