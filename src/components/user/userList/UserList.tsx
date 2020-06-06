import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp } from 'hooks';
import { useHistory, useParams } from 'react-router-dom';
import { CustomToolbar } from 'common';

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
  const {
    userHook: { requestUsers, users }
  } = useMainApp();
  const { businessId } = useParams();

  const history = useHistory();

  React.useEffect(() => {
    if (businessId && requestUsers) {
      requestUsers(businessId || '');
    }
  }, [requestUsers, businessId]);

  const handleClick = React.useCallback(
    (_, rowMeta: any) => {
      if (users) {
        const userSelected = users[rowMeta.rowIndex] as IUser;
        console.error('userSelected', userSelected);
        history.push(`/user/edit/${userSelected.userId}/${businessId}`);
      }
    },
    [users]
  );

  const getCustomToolBarWithId = React.useCallback(() => <CustomToolbar location={`/user/edit/new/${businessId}`} />, [businessId]);

  const options = {
    filter: false,
    onRowClick: handleClick,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: 'single',
    responsive: 'stacked',
    customToolbar: getCustomToolBarWithId
  } as MUIDataTableOptions;

  return (
    <React.Fragment>
      <MUIDataTable title="Users" data={users as object[]} columns={columns} options={options} />
    </React.Fragment>
  );
};

export default Business;
