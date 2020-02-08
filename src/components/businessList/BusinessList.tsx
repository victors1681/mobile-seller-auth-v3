import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp } from 'hooks';
import { Business } from 'contexts/MainApp';
import { useHistory } from 'react-router-dom';

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
  const { requestBusiness, business } = useMainApp();
  const history = useHistory();

  React.useEffect(() => {
    requestBusiness();
  }, [requestBusiness]);

  const handleClick = (_, { rowIndex }: { rowIndex: number }) => {
    const dataBusiness: Business = business[rowIndex];
    history.push(`users/${dataBusiness.businessId}`);
  };

  const options = {
    filterType: 'checkbox',
    onRowClick: handleClick
  } as MUIDataTableOptions;

  return <MUIDataTable title="Empresas" data={business} columns={columns} options={options} />;
};

export default BusinessList;
