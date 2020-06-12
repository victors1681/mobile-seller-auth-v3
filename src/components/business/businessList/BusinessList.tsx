import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useMainApp } from 'hooks';
import { useHistory } from 'react-router-dom';
import { CustomToolbar, Loader } from 'common';
import { IconButton, Tooltip } from '@material-ui/core';
import { Edit, People, SettingsEthernet } from '@material-ui/icons';

const BusinessList = (): React.ReactElement => {
  const {
    businessHook: { requestBusiness, business, isLoading, testServerConnection }
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

  const handleEdit = React.useCallback(
    (_, { rowIndex }: { rowIndex: number }) => {
      if (business) {
        const dataBusiness = business[rowIndex] as IBusiness;
        history.push(`business/edit/${dataBusiness.businessId}`);
      }
    },
    [business]
  );

  const handleTestServer = React.useCallback(
    async (_, { rowIndex }: { rowIndex: number }) => {
      if (business) {
        const dataBusiness = business[rowIndex] as IBusiness;
        testServerConnection(dataBusiness.config.serverUrl, dataBusiness.config.serverPort);
      }
    },
    [business]
  );

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
    },
    {
      name: 'Edit',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <Tooltip title="Editar" aria-label="">
              <IconButton aria-label="edit" color="primary" size="small" onClick={(e) => handleEdit(e, tableMeta)}>
                <Edit fontSize="inherit" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    },
    {
      name: 'ver',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <Tooltip title="Usuarios de esta empresa" aria-label="">
              <IconButton aria-label="view users" color="primary" size="small" onClick={(e) => handleClick(e, tableMeta)}>
                <People fontSize="inherit" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    },
    {
      name: 'ver',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <Tooltip title="Probar conexión con el servidor" aria-label="">
              <IconButton aria-label="view users" color="primary" size="small" onClick={(e) => handleTestServer(e, tableMeta)}>
                <SettingsEthernet fontSize="inherit" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    }
  ];

  const getCustomToolBarWithId = React.useCallback(() => <CustomToolbar location="/business/edit/new/" />, []);

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    responsive: 'vertical',
    selectableRows: 'none',
    customToolbar: getCustomToolBarWithId
  } as MUIDataTableOptions;

  return (
    <>
      <Loader isLoading={isLoading} />
      <MUIDataTable title="Empresas" data={business as object[]} columns={columns} options={options} />
    </>
  );
};

export default BusinessList;
