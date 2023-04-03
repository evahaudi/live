import React, { useState, useEffect } from "react";
import { Box,Typography,useTheme} from "@mui/material";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Graph = () => {
  const [owners, setOwners] = useState([]);
  const [falseImports, setFalseImports] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // useEffect(() => {
  //   fetch(`http://10.153.1.85:8000/fraud_app/api/v1/owner_and_false_imports/${props.pinNo}/`)
  //     .then(response => response.json())
  //     .then(data => {
  //       const parsedOwners = JSON.parse(data.owners);
  //       setOwners(parsedOwners);
  //       const parsedFalseImports = JSON.parse(data.false_imports);
  //       setFalseImports(parsedFalseImports);
  //     })
  //     .catch(error => console.error(error));
  // }, [props.pinNo]);
  // console.log(owners);
  // console.log(falseImports);


  useEffect(() => {
    fetch(`http://10.153.1.85:8000/fraud_app/api/v1/owner_and_false_imports/P051193029R/`)
      .then(response => response.json())
      .then(data => {
        const parsedOwners = JSON.parse(data.owners);
        setOwners(parsedOwners);
        const parsedFalseImports = JSON.parse(data.false_imports);
        setFalseImports(parsedFalseImports);
      })
      .catch(error => console.error(error));
  }, []);
  console.log(owners);
  console.log(falseImports);

  const ownersColumns = [
    { field: "tax_payer_name", headerName: "  TAXPAYER NAME", width: 200 },
    { field: "pin_no", headerName: "PIN No", width: 150 },
    { field: "associated_entity_type", headerName: "ASSOCIATED ENTITY TYPE", width: 250 },
    { field: "associated_entity_pin", headerName: "ASSOCIATED ENTITY PIN", width: 200 }
  ];

  const falseImportsColumns = [
    { field: "cust_entry_no_prn", headerName: "CUST ENTRY NO PRN", width: 250 },
    { field: "invoice_no", headerName: "INVOICE NO", width: 150 },
    { field: "lookup_code", headerName: "LOOKUP CODE", width: 200 },
    { field: "suppliers_name", headerName: "SUPPLIERS NAME", width: 250 },
    { field: "invoice_date", headerName: "INVOICE DATE", width: 150 }
  ];

  return (
    // <div>
    //   <h2>Owners</h2>
    //   <DataGrid rows={owners} columns={ownersColumns} pageSize={10} />
    //   <h2>False Imports</h2>
    //   <DataGrid rows={falseImports} columns={falseImportsColumns} pageSize={10} />
    // </div>

    <Box m="20px">
    <Header
      title="Imports & owners"
      subtitle="False imports  and owners data"
    />
    <Box
      m="40px 0 0 0"
      height="36vh"
      width="1200px"
      
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "0.5px solid",
          fontFamily: 'Roboto, sans-serif',
          fontSize:14,
        },
        "& .name-column--cell": {
          color: colors.white[100],
          fontFamily: 'Roboto, sans-serif',
          fontSize:14,
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.black[300],
          color: colors.white[100],
          borderBottom: "none",
          fontFamily: 'Roboto, sans-serif',
          fontSize:14,
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.redAccent[500],
       
        },
        "& .MuiCheckbox-root": {
          color: `${colors.redAccent[400]} !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
      }}
    > 

 <DataGrid
  rows={falseImports}
  columns={falseImportsColumns}
  checkboxSelection
  pageSize={20}
  rowsPerPageOptions={[20]}
  components={{
    Toolbar: GridToolbar,
  }}

/>

</Box>  
<Box
      m="40px 0 0 0"
      height="36vh"
      width="1000px"
      
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "0.5px solid",
          fontFamily: 'Roboto, sans-serif',
          fontSize:14,
        },
        "& .name-column--cell": {
          color: colors.white[100],
          fontFamily: 'Roboto, sans-serif',
          fontSize:14,
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.black[300],
          color: colors.white[100],
          borderBottom: "none",
          fontFamily: 'Roboto, sans-serif',
          fontSize:14,
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.redAccent[500],
       
        },
        "& .MuiCheckbox-root": {
          color: `${colors.redAccent[400]} !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
      }}
    > 

<DataGrid
  rows={owners}
  columns={ownersColumns}
  rowKey="id"
  checkboxSelection
  pageSize={20}
  rowsPerPageOptions={[20]}
  components={{
    Toolbar: GridToolbar,
  }}
  
/>

</Box>  
    <Box textAlign="center"  >
        <Typography variant="h5" color={colors.grey[100]}>
          @2023KRA Copyrights.
        </Typography>   
      </Box>  
  </Box>
  );
}
export default Graph;
