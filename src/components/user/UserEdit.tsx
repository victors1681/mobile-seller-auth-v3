import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { User } from 'contexts/MainApp';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

export const UserEdit = ({ userData, handleClose }: { userData: User; handleClose: () => void }) => {
  const renderForm = () => {
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Shipping address {userData.email}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField required id="firstName" name="firstName" label="First name" fullWidth autoComplete="fname" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="lastName" name="lastName" label="Last name" fullWidth autoComplete="lname" />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="address1" name="address1" label="Address line 1" fullWidth autoComplete="billing address-line1" />
          </Grid>
          <Grid item xs={12}>
            <TextField id="address2" name="address2" label="Address line 2" fullWidth autoComplete="billing address-line2" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="city" name="city" label="City" fullWidth autoComplete="billing address-level2" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="state" name="state" label="State/Province/Region" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="zip" name="zip" label="Zip / Postal code" fullWidth autoComplete="billing postal-code" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="country" name="country" label="Country" fullWidth autoComplete="billing country" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox color="secondary" name="saveAddress" value="yes" />} label="Use this address for payment details" />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <DialogContent>{renderForm()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Subscribe
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
export default UserEdit;
