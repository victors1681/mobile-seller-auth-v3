import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from "mui-datatables";
import { useMainApp }  from "hooks";
 
const options = {
  filterType: 'checkbox',
};

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
 ];



const Business: FunctionComponent = (): ReactElement => {
            
    const mainApp = useMainApp();

    React.useEffect(()=>{
       console.log("")
       mainApp.requestBusiness();
    }, [])
 
  return (
    <Grid container component="main" >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}/>
      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={0} square>
      <MUIDataTable
        title={"Empresas"}
        data={mainApp.business}
        columns={columns}
        options={options}
      />
      </Grid>
    </Grid>
  );
};

export default Business;
