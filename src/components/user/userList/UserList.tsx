import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp, UserTypeEnum } from 'hooks';
import { useHistory, useParams } from 'react-router-dom';
import { CustomToolbar } from 'common';

const columns = [
  {
    name: 'sellerCode',
    label: 'Codigo',
    options: {
      filter: true,
      sort: true
    }
  },
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
    userHook: { requestUsers, users },
    currentUser
  } = useMainApp();
  const { businessId } = useParams();

  const history = useHistory();

  React.useEffect(() => {
    if (UserTypeEnum.superuser !== currentUser?.type || !businessId) {
      //Regular admin user only can query the business tied to the current user
      const currentBusinessId = currentUser?.business.businessId;
      if (currentBusinessId) {
        requestUsers(currentBusinessId);
      }
    }
    if (businessId && requestUsers && currentUser?.type === UserTypeEnum.superuser) {
      requestUsers(businessId || '');
    }
  }, [requestUsers, businessId, currentUser]);

  const handleClick = React.useCallback(
    (_, rowMeta: any) => {
      if (users) {
        const userSelected = users[rowMeta.dataIndex] as IUser;
        history.push(`/user/edit/${userSelected.userId}/${userSelected.business}`);
      }
    },
    [users]
  );

  const getCustomToolBarWithId = React.useCallback(() => <CustomToolbar location={`/user/edit/new/${businessId}`} />, [businessId]);

  const options = {
    filter: false,
    onRowClick: handleClick,
    responsive: 'vertical',
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: 'none',
    customToolbar: getCustomToolBarWithId
  } as MUIDataTableOptions;

  return (
    <React.Fragment>
      <MUIDataTable title="Users" data={users as object[]} columns={columns} options={options} />
    </React.Fragment>
  );
};

export default Business;
