import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CustomSelect } from 'common/customSelect';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMainApp } from 'hooks/useMainApp';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createSellerOptions } from 'common/utils/createSellerOptions';
//import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import styled from 'styled-components';
import { Loader } from 'common';

const Icon = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const validationSchema = Yup.object().shape({
  sellerTarget: Yup.string().required('Requerido'),
  sellerSource: Yup.string().required('Requerido')
});

interface IMessage {
  sellerTarget: string;
  sellerSource: string;
}

interface TransferUserProps {
  open: boolean;
  handleClose: () => void;
}
export const TransferUser: React.FC<TransferUserProps> = ({ open, handleClose }) => {
  const [sellersOption, setSellerOption] = React.useState<SelectOptions[]>([]);

  const {
    userHook: { requestUsers, users, transferUser },
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

  const handleSubmission = async (values: IMessage, resetForm: any) => {
    const result = await transferUser(values.sellerSource, values.sellerTarget);
    await requestUsers(currentUser?.business.businessId);

    if (result) {
      resetForm();
      handleClose();
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { sellerSource: '', sellerTarget: '' } as IMessage,
    onSubmit: (values, { resetForm }) => {
      //send message:
      handleSubmission(values, resetForm);
    },
    validationSchema
  });

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={formik.handleSubmit}>
          <Loader isLoading={formik.isSubmitting} />
          <DialogTitle id="form-dialog-title">Cambio de código entre vendedores</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Esta opción es para transferir ruta de ventas entre dos vendedores, verifique que ambos equipos cieren sesión en las iPads, luego realice el traspase de códigos y luego inicie sesión en
              las iPads{' '}
            </DialogContentText>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <CustomSelect
                  required
                  label="Vendedor 1"
                  name="sellerSource"
                  options={sellersOption}
                  handleChange={formik.handleChange}
                  defaultValue={formik.values.sellerSource}
                  error={!!formik.errors.sellerSource && formik.touched.sellerSource}
                  helperText={formik.errors.sellerSource}
                />
              </Grid>
              <Icon item xs={2}>
                <SyncAltIcon />
              </Icon>
              <Grid item xs={5}>
                <CustomSelect
                  required
                  label="Vendedor 2"
                  name="sellerTarget"
                  options={sellersOption}
                  handleChange={formik.handleChange}
                  defaultValue={formik.values.sellerTarget}
                  error={!!formik.errors.sellerTarget && formik.touched.sellerTarget}
                  helperText={formik.errors.sellerTarget}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Proceder
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TransferUser;
