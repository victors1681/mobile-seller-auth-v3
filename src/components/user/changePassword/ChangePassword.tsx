import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMainApp } from 'hooks';

const schemaValidation = Yup.object({
  password: Yup.string()
    .min(6)
    .required('Contraseña requerida'),
  passwordConfirmation: Yup.string()
    .min(6)
    .oneOf([Yup.ref('password'), null], 'La contraseña no coincide')
});
export const ChangePassword = ({ userId }: { userId: string }) => {
  const [currentOpen, setCurrentOpen] = React.useState(false);
  const {
    userHook: { changePassword }
  } = useMainApp();

  const handleClickOpen = () => {
    setCurrentOpen(true);
  };

  const handleClose = () => {
    setCurrentOpen(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { password: '', passwordConfirmation: '' },
    onSubmit: async (values, { resetForm }) => {
      const response = await changePassword(userId, values.password);
      if (response) {
        resetForm({});
        handleClose();
      }
    },
    validationSchema: schemaValidation
  });

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Cambiar Contraseña
      </Button>
      <Dialog open={currentOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="form-dialog-title">Cambio de Contraseña</DialogTitle>
          <DialogContent>
            <TextField
              type="password"
              id="password"
              name="password"
              label="Contraseña"
              fullWidth
              error={!!formik.errors.password && formik.touched.password}
              helperText={formik.errors.password}
              autoComplete="new-password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <TextField
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              label="Confirmar Contraseña"
              fullWidth
              error={!!formik.errors.passwordConfirmation && formik.touched.passwordConfirmation}
              helperText={formik.errors.passwordConfirmation}
              autoComplete="new-passwordConfirmation"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirmation}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Actualizar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ChangePassword;
