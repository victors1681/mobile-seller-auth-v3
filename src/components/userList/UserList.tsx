import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import MUIDataTable from "mui-datatables";
import { useMainApp }  from "hooks";
import { Business as BusinessInterface, Business } from 'contexts/MainApp';
import { useHistory } from "react-router-dom";

const columns = [
  {
   name: "firstName",
   label: "Nombre",
   options: {
    filter: true,
    sort: true,
   }
  },
  {
   name: "lastName",
   label: "Apellido",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
   name: "email",
   label: "Teléfono",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
   name: "phone",
   label: "Teléfono",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
    name: "testMode",
    label: "Modo Prueba",
    options: {
     filter: true,
     sort: false,
    }
   },
 ];



const Business: FunctionComponent = (): ReactElement => {
            
    const mainApp = useMainApp();
    const history = useHistory();

    React.useEffect(()=>{
       mainApp.requestUsers();
    }, [])


const handleClick= (_, rowMeta: any) => {
 
  const dataBusiness: BusinessInterface = mainApp.business[rowMeta.rowIndex];
  history.push(`users/${dataBusiness.businessId}`);
}
 
const options = {
  filterType: 'checkbox',
  onRowClick:handleClick
};

  return ( 
      <MUIDataTable
        title={"Users"}
        data={mainApp.users}
        columns={columns}
        options={options}
        selectableRowsOnClick={true}
      /> 
  );
};

export default Business;
