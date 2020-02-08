import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp } from 'hooks';
import { User } from 'contexts/MainApp';
import Dialog from '@material-ui/core/Dialog';

import DialogTitle from '@material-ui/core/DialogTitle';

import UserEdit from '../UserEdit';

const columns = [
  {
    name: 'firstName',
    label: 'Nombre',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'lastName',
    label: 'Apellido',
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: 'email',
    label: 'Teléfono',
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: 'phone',
    label: 'Teléfono',
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: 'testMode',
    label: 'Modo Prueba',
    options: {
      filter: true,
      sort: false
    }
  }
];

const UserEditModal = ({ open, handleClose, userData }: { open: boolean; handleClose: () => void; userData: User }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>

      <UserEdit userData={userData} handleClose={handleClose} />
    </Dialog>
  );
};

const Business = (): React.ReactElement => {
  const [userData, setUserData] = React.useState<User>(null);
  const mainApp = useMainApp();

  React.useEffect(() => {
    mainApp.requestUsers();
  }, [mainApp]);

  const handleClose = () => setUserData(null);

  const handleClick = (_, rowMeta: any) => {
    const userSelected = mainApp.users[rowMeta.rowIndex] as User;
    setUserData(userSelected);

    //history.push(`users/${userData}`);
  };

  const options = {
    filterType: 'checkbox',
    onRowClick: handleClick
  } as MUIDataTableOptions;

  return (
    <React.Fragment>
      <UserEditModal open={!!userData} handleClose={handleClose} userData={userData} />
      <MUIDataTable title="Users" data={mainApp.users} columns={columns} options={options} />
    </React.Fragment>
  );
};

export default Business;
