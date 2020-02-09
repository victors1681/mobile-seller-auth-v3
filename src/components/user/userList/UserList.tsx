import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp } from 'hooks';
import { User } from 'contexts/MainApp';
import { useHistory } from 'react-router-dom';

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

const Business = (): React.ReactElement => {
  const { requestUsers, users } = useMainApp();
  const history = useHistory();

  React.useEffect(() => {
    requestUsers();
  }, [requestUsers]);

  const handleClick = (_, rowMeta: any) => {
    const userSelected = users[rowMeta.rowIndex] as User;
    console.error('userSelected', userSelected);
    history.push(`/user/edit/${userSelected.userId}`);
  };

  const options = {
    filterType: 'checkbox',
    onRowClick: handleClick
  } as MUIDataTableOptions;

  return (
    <React.Fragment>
      <MUIDataTable title="Users" data={users} columns={columns} options={options} />
    </React.Fragment>
  );
};

export default Business;
