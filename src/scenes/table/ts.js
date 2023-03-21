import { Box,Typography,useTheme ,IconButton,Button} from "@mui/material";


import Swal from 'sweetalert2';
import { useState ,useEffect} from 'react';
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Header from "../../components/Header";


const Employee = () => {
  const [customer, setCustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  
  

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getFilteredRows = () => {
    return customer.filter(
      row =>
        row.pinNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.taxpayerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // const handleRowSelect = (selection) => {
  //   // Add/remove pinNo from selectedRows array
  //   setSelectedRows(selection.rows.map(row => row.pinNo));
  // }
  

  // const handleRowSelect = (selection) => {
  //   // Add/remove pinNo from selectedRows array
  //   if (selection?.rows) {
  //     setSelectedRows(selection.rows.map(row => row.pinNo));
  //   }
  // }

  const handleRowSelect = (selection) => {
    // Add/remove pinNo from selectedRows array
    if (selection?.rows) {
      setSelectedRows(selection.rows.map(row => row.original.pinNo));
    }
  }
  
  
  // const handleButtonClick = (pinNo) => {
  //   // Call REST API with pinNo as parameter and display results in dialog box
  //   fetch(`http://10.153.1.85:8081/api/directorDetails?pinNo=${pinNo}`)
  //     .then(response => response.json())
  //     .then(data => {
  //       // Display data in dialog box
  //       alert(JSON.stringify(data));
  //     });
  // }

  
  const handleButtonClick = () => {
    // Check how many rows are selected
    if (selectedRows.length === 0) {
      alert('Please select a row first.');
    } else if (selectedRows.length === 1) {
      // Call REST API with pinNo as parameter and update state with response data
      const pinNo = selectedRows[0];
      fetch(`http://10.153.1.85:8081/api/directorDetails?pinNo=${pinNo}`)
        .then(response => response.json())
        .then(data => {
          // Check if data is an array
          if (Array.isArray(data)) {
            setData(data);
            // Show SweetAlert with table of data
            Swal.fire({
              title: 'Directors details',
              html: `
                <table>
                  <thead>
                  <tr>
                  <div style="text-align: left,padding:10px">
                  <th>Pin No</th>
                  <th>Associated Pin</th>
                  <th>Associated Type</th>
                  </div>
                </tr>
                  </thead>
                  <tbody>
                    ${data.map(item => `
                      <tr>
                      <td >${item.pinNo}</td>
  
                        <td>${item.associatedEntityPin}</td>
                        <td>${item.associatedEntityType}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `
              ,
              showCloseButton: true,
              showConfirmButton: false,
            });
          } else {
            // Handle error when data is not an array
            console.error('Response data is not an array:', data);
          }
        })
        .catch(error => {
          // Handle error when fetch fails
          console.error('Fetch error:', error);
        });
    } else {
      // Call REST API with selected pinNos as parameters and update state with response data
      const pinNos = selectedRows.join(',');
      fetch(`http://10.153.1.85:8081/api/directorDetails?pinNos=${pinNos}`)
        .then(response => response.json())
        .then(data => {
          // Check if data is an array
          if (Array.isArray(data)) {
            setData(data);
            // Show SweetAlert with table of data
            Swal.fire({
              title: 'Directors details',
              html: `
                <table>
                  <thead>
                  <tr>
                  <div style="text-align: left,padding:10px">
                  <th>Pin No</th>
                  <th>Associated Pin</th>
                  <th>Associated Type</th>
                  </div>
                </tr>
                  </thead>
                  <tbody>
                    ${data.map(item => `
                      <tr>
                      <td >${item.pinNo}</td>
  
                        <td>${item.associatedEntityPin}</td>
                        <td>${item.associatedEntityType}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `
              ,
              showCloseButton: true,
              showConfirmButton: false,
            });
          } else {
            // Handle error when data is not an array
            console.error('Response data is not an array:', data);
          }
        })
        .catch(error => {
          // Handle error when fetch fails
          console.error('Fetch error:', error);
        });
    }
  };
  
  
  const handleButton = async () => {
    try {
      if (!selectedRows || selectedRows.length === 0) {
        console.error('Selected rows is undefined, null, or empty');
        return;
      }
  
      const pinsParam = selectedRows.join(',');
  
      // Call REST API with all selected pins as parameters and update state with response data
      const response = await fetch(`http://10.153.1.85:8081/api/directorDetails?pinNos=${pinsParam}`);
      console.log(response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
  
      // Check if data is an array
      if (Array.isArray(data)) {
        setData(data);
        console.log(data);
        // Show SweetAlert with table of data
        Swal.fire({
          title: 'Directors details',
          html: `
            <table>
              <thead>
                <tr>
                  <th>Pin No</th>
                  <th>Associated Pin</th>
                  <th>Associated Type</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(item => `
                  <tr>
                    <td>${item.pinNo}</td>
                    <td>${item.associatedEntityPin}</td>
                    <td>${item.associatedEntityType}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `,
          showCloseButton: true,
          showConfirmButton: false,
        });
      } else {
        // Handle error when data is not an array
        console.error('Response data is not an array:', data);
      }
    } catch (error) {
      // Handle error when fetch fails
      console.error('Fetch error:', error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while fetching data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  
  const columns = [
   
    { field: "pinNo", headerName: "KRA PIN No.", headerAlign: "left", fontSize: 40, width: 130},
    { field: "taxpayerName", headerName: "TAXPAYER NAME", headerAlign: "left", fontSize: 40, width: 200},
    { field: "suppliersName", headerName: "SUPPLIER NAME", headerAlign: "left", fontSize: 16, width: 250},
    // { field: "amntBeforeTax",headerName: "AMOUNT BEFORE TAX",type: "number", headerAlign: "left", fontSize: 16, width: 180},
    { field: "purchTotal",headerName: "TOTAL PURCHASE",type:"number", headerAlign: "left", fontSize: 16, width: 150,},
    { field: "trpFromDt",headerName: "trpFromDt", headerAlign: "left",fontSize: 16, width: 100},
    { field: "trpToDt",headerName: "trpToDt", headerAlign: "left",fontSize: 16, width: 100},
    // { field: "suppliersPin", headerName: "SUPPLIER PIN", headerAlign: "left", fontSize: 16, width: 150},
    { field: "invoiceNo",headerName: "INVOICE NUMBER", headerAlign: "left", fontSize: 16, width: 150},
    { field: "invoiceDate",headerName: "INVOICE DATE", headerAlign: "left", fontSize: 16, width: 150},
    { field: "lookupCode",headerName: "LOOKUP CODE", headerAlign: "left", fontSize: 16, width: 120},
    // { field: "typeOfPurchases",headerName: "PURCHASE TYPE", headerAlign: "left", fontSize: 16, width:140},
    // {
    //   field: "ACTION",
    //   headerName: "Action",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <Button variant="outlined" color="primary">
    //         associate
    //       </Button>
    //     );
    //   },
    // },
    { field: 'viewData', headerName: 'ACTION', width: 150,
      renderCell: (params) => (
        < Button  variant="outlined" color="primary" onClick={() => handleButtonClick(params.row.pinNo)}>associated</Button>
      )
    },
  ];

  useEffect(() => {
    fetch("http://10.153.1.85:8081/api/falseImports")
      .then(response => response.json())
      .then(json => setCustomer(json.content))
      .catch(error => console.error(error));
  }, []);
  console.log(customer)

  return (
    <Box m="20px">
      <Header
        title="Imports"
        subtitle="False imports data"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
            // color: colors.greenAccent[300],
            color: colors.white[100],
          
              fontFamily: 'Roboto, sans-serif',
              fontSize:14,
          
          },
          "& .MuiDataGrid-columnHeaders": {
            // backgroundColor: colors.blueAccent[700],
            // background: `linear-gradient(to bottom, ${colors.black[100]}  50%, ${colors.redAccent[500]} 50%)`,
            backgroundColor: colors.black[300],
            color: colors.white[100],
            
           
            borderBottom: "none",
            fontFamily: 'Roboto, sans-serif',
              fontSize:14,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
            // backgroundColor: colors.black[200],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            // backgroundColor: colors.blueAccent[700],
            backgroundColor: colors.redAccent[500],
            // background: `linear-gradient(to bottom, ${colors.redAccent[500]} 50%, ${colors.black[100]} 50%)`,
            color: colors.white[100],
            
          },
          "& .MuiCheckbox-root": {
            // color: `${colors.greenAccent[200]} !important`,
            color: `${colors.redAccent[400]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          
          },
          
        }}
      > 
       
        <DataGrid
          // rows={customer}
          rows={getFilteredRows()}
          columns={columns}
          // components={{ Toolbar: GridToolbar }}
          components={{
            Toolbar: () => (
              <div >
                     
              
                <Box
                  display="flex"
                  justifyContent="flex-end"

                  backgroundColor={colors.primary[400]}
                  // borderRadius="3px"
                  // posistion="fixed"
                  marginLeft="80%"
                  maxWidth="300px"
                              
                  >
                  {/* <input type="text" value={searchQuery} onChange={handleInputChange} /> */}
                  <InputBase sx={{ ml: 2, flex: 1,  position:"end"}} placeholder="Search by taxpayer name or pin" value={searchQuery} onChange={handleInputChange} />
                  <IconButton type="button"  sx={{ p: 1}}>
                  <SearchIcon />
                  </IconButton>
                  </Box>
                  <Box display="flex" marginBottom="20px"     >
                  {/* <GridToolbar/> */}
                  <GridToolbar/>
                  <Button variant="contained" color="primary" onClick={handleButton}>
                   Analyze
                  </Button>
                
                 
                </Box>
                  
              </div>
            ),
          }}
          
          pageSize={20}
          rowsPerPageOptions={[20]}
          checkboxSelection
          onSelectionModelChange={handleRowSelect}
          disableSelectionOnClick
        />
        <Box textAlign="center"  m="20px"  >
      <Typography variant="h5" color={colors.grey[100]}>
      @2023KRA Copyrights.All rights reserved.
      </Typography>
        
      </Box>
      </Box>
      
    </Box>
  );
};

export default Employee;









// import React, { useState, useEffect } from 'react';
// import { DataGrid, GridToolbar } from '@material-ui/data-grid';
// import MyDialogBox from './MyDialogBox';

// function MyDataGridTable() {
// const [open, setOpen] = useState(false);
// const [pinNo, setPinNo] = useState(null);
// const [rowData, setRowData] = useState([]);

// const handleButtonClick = () => {
// setOpen(true);
// };

// const handleSelectionChange = (selection) => {
// const selectedRows = selection.rows;
// if (selectedRows.length > 0) {
// const pinNoValue = selectedRows[0].pinNo;
// setPinNo(pinNoValue);
// }
// };

// useEffect(() => {
// const fetchData = async () => {
// if (pinNo !== null) {
// try {
// const response = await fetch(https://my-api.com/data?pinNo=${pinNo});
// const data = await response.json();
// setRowData(data);
// } catch (error) {
// console.log(error);
// }
// }
// };
// fetchData();
// }, [pinNo]);

// return (
// <div>
// <DataGrid rows={rowData} columns={columns} onSelectionChange={handleSelectionChange} />
// <GridToolbar>
// <Button variant="outlined" onClick={handleButtonClick}>
// Open Dialog Box
// </Button>
// </GridToolbar>
// <MyDialogBox open={open} onClose={() => setOpen(false)} rowData={rowData} />
// </div>
// );
// }