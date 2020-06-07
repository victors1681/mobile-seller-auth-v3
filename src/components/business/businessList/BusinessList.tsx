import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp } from 'hooks';
import { useHistory } from 'react-router-dom';
import { CustomToolbar } from 'common';

const columns = [
  {
    name: 'name',
    label: 'Nombre',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'email',
    label: 'Email',
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
    name: 'contact',
    label: 'Contacto',
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: 'config.testMode',
    label: 'Modo Prueba',
    options: {
      filter: true,
      sort: false
    }
  }
];

const BusinessList = (): React.ReactElement => {
  const {
    businessHook: { requestBusiness, business }
  } = useMainApp();
  const history = useHistory();

  React.useEffect(() => {
    if (requestBusiness) {
      requestBusiness();
    }
  }, [requestBusiness]);

  const handleClick = React.useCallback(
    (_, { rowIndex }: { rowIndex: number }) => {
      if (business) {
        const dataBusiness = business[rowIndex] as IBusiness;
        history.push(`users/${dataBusiness.businessId}`);
      }
    },
    [business]
  );

  const getCustomToolBarWithId = React.useCallback(() => <CustomToolbar location="/business/edit/new/" />, []);

  const options = {
    filter: false,
    onRowClick: handleClick,
    print: false,
    download: false,
    viewColumns: false,
    responsive: 'stacked',
    selectableRows: 'none',
    customToolbar: getCustomToolBarWithId
  } as MUIDataTableOptions;

  return <MUIDataTable title="Empresas" data={business as object[]} columns={columns} options={options} />;
};

export default BusinessList;
