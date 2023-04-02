import { Box,Typography,useTheme ,IconButton,Button, Menu, MenuItem} from "@mui/material";
import Swal from 'sweetalert2';
import { useState ,useEffect} from 'react';
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InputBase from "@mui/material/InputBase";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { v4 as uuidv4 } from 'uuid';
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Customer = () => {
  const [tax, setTax] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  
  
  const [selectionModel, setSelectionModel] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectionModel(id);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleOpenSwal = (id) => {
    setAnchorEl(null);
    Swal({
      content: (
        <div>
          <iframe
            src="http://127.0.0.1:5500/index.html"
            height="00"
            width="1000"
            title="popoto"
            style={{ border: "1px", borderRadius: "20px" }} // add custom styles
          />
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      
    });
  };

  
 
  const CustomMenuItem = ({ onClick }) => (
    <div onClick={onClick}>
      <iframe
        src="http://127.0.0.1:5500/index.html"
        height="700"
        width="1250"
        title="popoto"
        style={{ border: "none", borderRadius: "5px" }} // add custom styles
      />
    </div>
  );
  
  
  // const getFilteredRows = () => {
  //   return customer.filter(
  //     row =>
  //       row.pinNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       row.taxpayerName.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };
  

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleButtonClick = () => {
   
    
    let selectedPins = [];
    if (selectionModel.length === 1) {
      const selectedRow = tax.find((row) => row.id === selectionModel[0]);
      selectedPins.push(selectedRow?.pinNo);
    } else if (selectionModel.length > 1) {
      selectedPins = selectionModel.map((id) => tax.find((row) => row.id === id)?.pinNo);
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
  
    let url = 'http://10.153.1.85:8000/fraud_app/api/v1/Directors/';
    if (selectedPins.length === 1) {
      url += `?pinNo=${selectedPins[0]}`;
    } else {
      url += `?pinNo=${selectedPins.join(',')}`;
    }
  
    fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Response not OK');
    }
  })
  .then(data => {
    if (Array.isArray(data)) {
      setData(data);

      Swal.fire({
        title: 'Directors details',
        html: `
        <table style="font-family: arial, sans-serif; border-collapse: collapse; width: 900px; ">

        <thead>
          <tr style="background-color: #dddddd;">
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; ">Pin No</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Name</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Associated Pin</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Associated Type</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr style="background-color: ${item.isOdd ? '#f2f2f2' : 'transparent'};">
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.pinNo}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.taxPayerName}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.associatedEntityPin}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.associatedEntityType}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
        `,
        showCloseButton: true,
        showConfirmButton: false,
        width: '1000px', // set the width of the Swal modal
        height: '500px', // set the height of the Swal modal
      });
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'No associated data found',
        confirmButtonColor: colors.redAccent[500],
      });
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
    Swal.fire({
      icon: 'warning',
      text: 'No associated data found',
      confirmButtonColor: colors.redAccent[500],
    });
  })
  .catch(error => {
    console.error('Network error:', error);
  });

        console.log(data)
  };
  
  

  const handleView = (pinNo) => {
   
    let url = `http://10.153.1.85:8000/fraud_app/api/v1/Directors/`;
   
  
    fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Response not OK');
    }
  })
  .then(data => {
    if (Array.isArray(data)) {
      setData(data);

      Swal.fire({
        title: 'Directors details',
        html: `
        <table style="font-family: arial, sans-serif; border-collapse: collapse; width: 900px; ">

        <thead>
          <tr style="background-color: #dddddd;">
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; ">Pin No</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Name</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Associated Pin</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Associated Type</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr style="background-color: ${item.isOdd ? '#f2f2f2' : 'transparent'};">
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.pin_no}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.tax_payer_name}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.associated_entity_pin}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.associated_entity_type}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
        `,
        showCloseButton: true,
        showConfirmButton: false,
        width: '1000px', // set the width of the Swal modal
        height: '500px', // set the height of the Swal modal
      });
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'No associated data found',
        confirmButtonColor: colors.redAccent[500],
      });
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
    Swal.fire({
      icon: 'warning',
      text: 'No associated data found',
      confirmButtonColor: colors.redAccent[500],
    });
  })
  .catch(error => {
    console.error('Network error:', error);
  });

        console.log(data)
  };
  
  

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      checkboxSelection: true, 
      hide:true,
    },
    
    { field: "pin_no", headerName: "PIN No.", headerAlign: "left", fontSize: 40, width: 120},
    { field: "tax_payer_name", headerName: "TAXPAYER NAME", headerAlign: "left", fontSize: 40, width: 240},
    { field: "associated_entity_pin", headerName: "ASSOCIATED PIN", headerAlign: "left", fontSize: 40, width: 240},
    { field: "associated_entity_type", headerName: "ASSOCIATED TYPE", headerAlign: "left", fontSize: 40, width: 240},

    {
      field: 'action',
      headerName: 'ACTION',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
         
          className={selectionModel.includes(params.row.id) ? 'selected' : ''}
          sx={{
            color: selectionModel.includes(params.row.id) ? colors.white[100]:colors.white[100],
            backgroundColor: selectionModel.includes(params.row.id)?colors.redAccent[800]:  colors.black[700] ,
            "&:hover": {
              backgroundColor: selectionModel.length > 1 ? colors.redAccent[700] : colors.black[600],
            },
    
            minWidth: '120px'
          }}
          onClick={() => handleView(params.row.pinNo)}
        >
          {selectionModel.includes(params.row.id) ? 'view' : 'view'}
        </Button>
      )
        
     },
     {
      field: 'GRAPH',
      headerName: 'GRAPH',
      width: 60,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(e) => handleClick(e, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
       <MenuItem onClick={() => handleOpenSwal(params.row.id)}>
       <CustomMenuItem onClick={() => handleOpenSwal(params.row.id)} />
       </MenuItem>
          </Menu>
        </div>
      ),
    }
    
    
    
  ];



  
  useEffect(() => {
    fetch('http://10.153.1.85:8000/fraud_app/api/v1/Directors/')
      .then(response => response.json())
      .then(data => {
        const results = data.results.map(item => ({
          id: uuidv4(),
          pin_no: item.pin_no,
          tax_payer_name:item.tax_payer_name,
          associated_entity_pin:item.associated_entity_pin,
          associated_entity_type:item.associated_entity_type
          }));
        setTax(results);
      })
      .catch(error => console.error(error));
  }, []);
  
  console.log(tax);
  






  return (
    <Box m="20px">
    <Header
      title="Imports"
      subtitle="False imports data"
    />
    <Box
      m="40px 0 0 0"
      height="72vh"
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
  rows={tax}
  columns={columns}
  rowKey="id"
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

  sx={{
    minWidth: "90px",
    backgroundColor: selectionModel.length >1 ?colors.redAccent[800]:  colors.black[700],
    color: selectionModel.length >1 ? colors.white[100]: colors.white[100] ,
    "&:hover": {
      backgroundColor: selectionModel.length > 1 ? colors.redAccent[700] : colors.black[600],
    },
  }}
 
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
  selectionModel={selectionModel} 
  onSelectionModelChange={(newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  }} 
  
  pageSize={20}
  rowsPerPageOptions={[20]}
/>
</Box>  
    <Box textAlign="center"  >
        <Typography variant="h5" color={colors.grey[100]}>
          @2023KRA Copyrights.
        </Typography>   
      </Box>  
  </Box>
  
  );
};

export default Customer;









