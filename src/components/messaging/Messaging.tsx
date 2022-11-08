import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Send from '@material-ui/icons/Send';
import { CustomSelect } from 'common/customSelect';
import { useFormik } from 'formik';
import { useMainApp } from 'hooks/useMainApp';
import Checkbox from '@material-ui/core/Checkbox';
import * as Yup from 'yup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toast } from 'react-toastify';
import { Loader } from 'common';
import { createSellerOptions } from 'common/utils/createSellerOptions';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Requerido'),
  message: Yup.string().required('Requerido')
});

interface IMessage {
  title: string;
  message: string;
  seller: string;
  all: boolean;
}

export default function Messaging() {
  const [open, setOpen] = React.useState(false);
  const [sellersOption, setSellerOption] = React.useState<SelectOptions[]>([]);

  const {
    userHook: { requestUsers, users },
    sendMessageAll,
    sendMessageToUser,
    currentUser
  } = useMainApp();

  React.useEffect(() => {
    if (open && users && users?.length == 0) {
      (async () => {
        await requestUsers(currentUser?.business.businessId);
      })();
    }
  }, [open]);

  React.useEffect(() => {
    const options = createSellerOptions(users);
    setSellerOption(options);
  }, [open, users && users.length]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmission = async (values: IMessage, resetForm: any) => {
    if (values.all) {
      const result = await sendMessageAll(values.title, values.message);
      if (result) {
        toast('Usuarios Notificados');
      }
    } else {
      const result = await sendMessageToUser(values.seller, values.title, values.message);
      if (result) {
        toast('Usuario Notificado');
      }
    }

    resetForm();
    handleClose();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { title: '', message: '', seller: '', all: false } as IMessage,
    onSubmit: (values, { resetForm }) => {
      //send message:
      handleSubmission(values, resetForm);
    },
    validationSchema
  });

  return (
    <div>
      <IconButton color="inherit" onClick={handleClickOpen}>
        <Send />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={formik.handleSubmit}>
          <Loader isLoading={formik.isSubmitting} />
          <DialogTitle id="form-dialog-title">Enviar Mensaje</DialogTitle>
          <DialogContent>
            <DialogContentText>Envíe notificaciones personalizadas al un usuario especifico o a todos.</DialogContentText>
            <CustomSelect
              required
              label="Vendedor"
              name="seller"
              disabled={formik.values.all}
              options={sellersOption}
              handleChange={formik.handleChange}
              defaultValue={formik.values.seller}
              error={!!formik.errors.seller && formik.touched.seller}
              helperText={formik.errors.seller}
            />
            <TextField
              required
              autoFocus
              name="title"
              margin="dense"
              id="title"
              label="Título"
              type="text"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.title}
              error={!!formik.errors.title && formik.touched.title}
              helperText={formik.errors.title}
            />
            <TextField
              required
              autoFocus
              name="message"
              margin="dense"
              id="message"
              label="Mensaje"
              type="text"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.message}
              error={!!formik.errors.message && formik.touched.message}
              helperText={formik.errors.message}
            />
            <FormControlLabel control={<Checkbox checked={formik.values.all} onChange={formik.handleChange} name="all" />} label="Enviar a todos" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button variant="contained" type="submit" color="primary">
              Enviar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
