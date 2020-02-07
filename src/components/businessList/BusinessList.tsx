import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import MUIDataTable from "mui-datatables";
import { useMainApp }  from "hooks";
import { Business as BusinessInterface, Business } from 'contexts/MainApp';
import { useHistory } from "react-router-dom";

const columns = [
  {
   name: "name",
   label: "Nombre",
   options: {
    filter: true,
    sort: true,
   }
  },
  {
   name: "email",
   label: "Email",
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
   name: "contact",
   label: "Contacto",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
    name: "config.testMode",
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
       console.log("")
       mainApp.requestBusiness();
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
        title={"Empresas"}
        data={mainApp.business}
        columns={columns}
        options={options}
        selectableRowsOnClick={true}
      /> 
  );
};

export default Business;
