import { Box,Typography,useTheme ,IconButton,Button,Checkbox} from "@mui/material";
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
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const getFilteredRows = () => {
    return customer.filter(
      row =>
        row.pinNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.taxpayerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const handleRowSelection = (row) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(row.id)) {
        return prevSelectedRows.filter((selectedId) => selectedId !== row.id);
      } else {
        return [...prevSelectedRows, row.id];
      }
    });
  };

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelectedRows(customer.map((row) => row.id));
//     } else {
//       setSelectedRows([]);
//     }
//   };

  const handleSelectionChange = (event) => {
    // do something with the selected rows
    if (event.target.checked) {
        setSelectedRows(customer.map((row) => row.id));
      } else {
        setSelectedRows([]);
      }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleButtonClick = () => {
    let selectedPins = [];
    if (selectedRows.length === 1) {
      const selectedRow = customer.find((row) => row.id === selectedRows[0]);
      selectedPins.push(selectedRow?.pinNo);
    } else if (selectedRows.length > 1) {
      selectedPins = selectedRows.map((id) => customer.find((row) => row.id === id)?.pinNo);
      console.log(selectedPins)
    }
    
    if (selectedPins.length === 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select at least one row',
        confirmButtonColor: colors.redAccent[500],
       
      });
      return;
    }
  
    let url = 'http://10.153.1.85:8081/api/directorDetails';
    if (selectedPins.length === 1) {
      url += `?pinNo=${selectedPins[0]}`;
    } else {
      url += `?pinNo=${selectedPins.join(',')}`;
    }
  
    fetch(url)
       .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setData(data);
            
            Swal.fire({
              title: 'Directors details',
              html: `
              <table style="font-family: arial, sans-serif; border-collapse: collapse; width: 100%;">
              <thead>
                <tr style="background-color: #dddddd;">
                  <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Pin No</th>
                  <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Associated Pin</th>
                  <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Associated Type</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(item => `
                  <tr style="background-color: ${item.isOdd ? '#f2f2f2' : 'transparent'};">
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.pinNo}</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.associatedEntityPin}</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.associatedEntityType}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
              `,
              showCloseButton: true,
              showConfirmButton: false,
            });
          } else {
            console.error('Response data is not an array:', data);
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
        console.log(data)
  };
  
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
        headerName: "",
        field: "checkbox",
        renderCell: (params) => {
          const id = params.getValue("id");
          const isChecked = selectedRows.includes(id);
          return (
            <Checkbox
              color="primary"
              checked={isChecked}
              onChange={() => handleRowSelection(id)}
            />
          );
        },
      
    },
    { field: "pinNo", headerName: "PIN No.", headerAlign: "left", fontSize: 40, width: 130},
    { field: "taxpayerName", headerName: "TAXPAYER NAME", headerAlign: "left", fontSize: 40, width: 200},
    { field: "suppliersName", headerName: "SUPPLIER NAME", headerAlign: "left", fontSize: 16, width: 250},
    { field: "purchTotal",headerName: "TOTAL PURCHASE",type:"number", headerAlign: "left", fontSize: 16, width: 150,},
    { field: "trpFromDt",headerName: "trpFromDt", headerAlign: "left",fontSize: 16, width: 100},
    { field: "trpToDt",headerName: "trpToDt", headerAlign: "left",fontSize: 16, width: 100},
    { field: "invoiceNo",headerName: "INVOICE NUMBER", headerAlign: "left", fontSize: 16, width: 150},
    { field: "invoiceDate",headerName: "INVOICE DATE", headerAlign: "left", fontSize: 16, width: 150},
    { field: "lookupCode",headerName: "LOOKUP CODE", headerAlign: "left", fontSize: 16, width: 120},
    // 
    {
      field: 'action',
      headerName: 'ACTION',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
         
          className={selectedRows.includes(params.row.id) ? 'selected' : ''}
          sx={{
            color: selectedRows.includes(params.row.id) ? undefined:colors.white[100],
            backgroundColor: selectedRows.includes(params.row.id)?colors.black[900] :  undefined ,
    
            minWidth: '120px'
          }}
          onClick={() => handleButtonClick(params.row.pinNo)}
        >
          {selectedRows.includes(params.row.id) ? 'Associated' : 'Select'}
        </Button>
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
      height="72vh"
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
  rows={getFilteredRows()}
  columns={columns}
  components={{
    Toolbar: () => (
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        padding={{ xs: "20px", sm: "0" }}
      >
      <Box display="flex" alignItems="center">
        <GridToolbar />
      <Box
          display="flex"
          alignItems="center"
          justifyContent={{ xs: "space-between", sm: "flex-end" }}
          flex={{ xs: "1 1 auto", sm: "0 1 auto" }}
          marginLeft={{ xs: "0", sm: "10px" }}
          marginBottom={{ xs: "20px", sm: "0" }}
        >
        <Button
  variant="contained"
  // color="primary"
  sx={{
    minWidth: "90px",
    backgroundColor: selectedRows.length >1 ?colors.redAccent[800]:  colors.black[700] ,
    color: selectedRows.length >1 ? undefined: colors.white[100] ,
  }}
  // disabled={selectedRows.length === 0}
  onClick={handleButtonClick}
>
  Analyze
</Button>


        
        </Box>
        </Box>
        <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            backgroundColor={colors.primary[400]}
            marginLeft={{ xs: "0", sm: "10px" }}
            marginBottom={{ xs: "27px", sm: "0" }}
          >
            <InputBase
              sx={{ ml: 2  }}
              placeholder="Search by taxpayer name or pin"
              value={searchQuery}
              onChange={handleInputChange}
             
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon  />
            </IconButton>
        </Box>
        
      </Box>
    ),
  }}
  checkboxSelection
  onSelectionModelChange={(model) =>
    handleSelectionChange(model.selectionModel)
  }
  pageSize={20}
  rowsPerPageOptions={[20]}
/>
</Box>  
    <Box textAlign="center" >
        <Typography variant="h5" color={colors.grey[100]}>
          @2023KRA Copyrights.
        </Typography>   
      </Box>  
  </Box>
  
  );
};

export default Employee;









