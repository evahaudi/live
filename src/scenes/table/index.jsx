import { Box, Typography, useTheme, IconButton, Button, Menu, MenuItem } from "@mui/material";
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactDOM from 'react-dom';

import InputBase from "@mui/material/InputBase";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { v4 as uuidv4 } from 'uuid';
import { tokens } from "../../theme";
import Header from "../../components/Header";


const PAGE_SIZE = 10;

const Employee = () => {
  const [customer, setCustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState([]);
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

  const ROWS_PER_PAGE = 10;
  console.log(ROWS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      let selectedPins = [];
      const selectedRows = customer.filter((row) =>
        selectionModel.includes(row.id)
      );
      selectedPins = selectedRows.map((row) => row?.pin_no);

      if (
        !setData ||
        !setTotalPages ||
        !setTableData
      ) {
        console.error("One or more state setters are not defined");
        return;
      }

      const pinParams = selectedPins.map((pin) => `pin_no=${pin}`).join("&");
      const url = `http://10.153.1.85:8000/fraud_app/api/v1/Directors/?page=${page}&limit=${ROWS_PER_PAGE}&${pinParams}`;
      console.log(url);

      try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.results.map(item => ({
          id: uuidv4(),
          pin_no: item.pin_no,
          tax_payer_name: item.tax_payer_name,
          associated_entity_pin: item.associated_entity_pin,
          associated_entity_type: item.associated_entity_type
        }));

        if (page === 1) {
          setTableData(results);
        } else {
          setTableData(prevTableData => [...prevTableData, ...results]);
        }

        setTotalPages(Math.ceil(data.count / ROWS_PER_PAGE));
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [page, selectionModel, customer]);
  console.log(tableData);

  function handlePageChange(newPage) {
    if (!isNaN(newPage)) {
      setPage(newPage > 1 ? 1 : newPage +1);
    }
  
  }
  // const handlePage = (page) => {
  //   setCurrentPage(page);
  // };

  const handleButtonClick = () => {
    if (!selectionModel || selectionModel.length === 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select at least one row',
        confirmButtonColor: colors.redAccent[500],
      });
      return;
    }

    if (!customer || !totalPages || !data) {
      console.error('Customer data or total pages or fetched data is not defined');
      return;
    }


    const columns = [
      { field: 'pin_no', headerName: 'PIN', width: 180 },
      { field: 'tax_payer_name', headerName: 'Name', width: 300 },
      { field: 'associated_entity_pin', headerName: 'ASSOCIATED PIN NO', width: 220 },
      { field: 'associated_entity_type', headerName: 'ASSOCIATED PIN TYPE', width: 220 },
    ];

    Swal.fire({
      title: 'Directors Details',
      showCloseButton: true,
      showConfirmButton: false,
      showcloseButtonColor: colors.redAccent[500],
      width: '1000px', // set the width of the Swal modal
      height: '500px', // set the height of the Swal modal
      html: '<div id="datagrid"></div>',
      didOpen: () => {
        ReactDOM.render(
          <div style={{ height: 700, width: '100%' }}>
            <DataGrid
              rows={tableData}
              columns={columns}
              rowKey="id"
              pagination
              pageSize={ROWS_PER_PAGE}
              rowCount={totalPages ? totalPages * ROWS_PER_PAGE : 0}
              onPageChange={handlePageChange}
            />
          </div>,
          document.getElementById('datagrid')
        );
      }
    });
  };

  const handleView = (pin_no) => {

    const pageParam = `page=${page}`;
    const pinParams = pin_no
    const url = `http://10.153.1.85:8000/fraud_app/api/v1/Directors/?${pageParam}&${pinParams}`;


    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Response not OK');
        }
      })
      .then(data => {
        const results = data.results;
        // const count = data.count;
        console.log(results)


        if (results.length > 0) {

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
          ${results.map(item => `
           <tr uuidv4()/>
            <tr key=${uuidv4()} >
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
      hide: true,
    },

    {
      field: "pin_no",
      headerName: "PIN No.",
      headerAlign: "left",
      fontSize: 40,
      width: 110,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "suppliers_name",
      headerName: "SUPPLIER NAME",
      headerAlign: "left",
      fontSize: 40,
      width: 300,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "trp_from_dt",
      headerName: "trpFromDt",
      headerAlign: "left",
      fontSize: 16,
      width: 100,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "trp_to_dt",
      headerName: "trpToDt",
      headerAlign: "left",
      fontSize: 16,
      width: 100,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "invoice_no",
      headerName: "INVOICE NUMBER",
      headerAlign: "left",
      fontSize: 16,
      width: 150,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "invoice_date",
      headerName: "INVOICE DATE",
      headerAlign: "left",
      fontSize: 16,
      width: 110,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "lookup_code",
      headerName: "LOOKUP CODE",
      headerAlign: "left",
      fontSize: 16,
      width: 120,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "station_name",
      headerName: "STATION",
      headerAlign: "left",
      fontSize: 16,
      width: 90,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "cust_entry_no_prn",
      headerName: "ENTRY NUMBER",
      headerAlign: "left",
      fontSize: 16,
      width: 150,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "amnt_before_tax",
      headerName: "AMNT BEFORE TAX",
      headerAlign: "left",
      fontSize: 16,
      width: 160,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "type_of_purchases",
      headerName: "PURCHASE",
      headerAlign: "left",
      fontSize: 16, width: 100,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'ACTION',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"

          className={selectionModel.includes(params.row.id) ? 'selected' : ''}
          sx={{
            color: selectionModel.includes(params.row.id) ? colors.white[100] : colors.white[100],
            backgroundColor: selectionModel.includes(params.row.id) ? colors.redAccent[800] : colors.black[700],
            "&:hover": {
              backgroundColor: selectionModel.length > 1 ? colors.redAccent[700] : colors.black[600],
            },

            minWidth: '120px'
          }}
          onClick={() => handleView(params.row.pin_no)}
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


    async function fetchData() {
      try {
        const response = await fetch(`http://10.153.1.85:8000/fraud_app/api/v1/FalseImports/?page=${page}&page_size=${PAGE_SIZE}`);
        const data = await response.json();

        const results = data.results.map(item => ({
          id: uuidv4(),
          pin_no: item.pin_no,
          suppliers_name: item.suppliers_name,
          trp_from_dt: item.trp_from_dt,
          trp_to_dt: item.trp_to_dt,
          invoice_no: item.invoice_no,
          invoice_date: item.invoice_date,
          lookup_code: item.lookup_code,
          station_name: item.station_name,
          cust_entry_no_prn: item.cust_entry_no_prn,
          amnt_before_tax: item.amnt_before_tax,
          type_of_purchases: item.type_of_purchases
        }));

        setCustomer(prevCustomer => {
          if (prevCustomer.length === 0) {
            return results;
          } else {
            return [...prevCustomer, ...results];
          }
        });

        setTotalPages(Math.ceil(data.count / PAGE_SIZE));
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [page]);



  console.log(customer);

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
            fontSize: 14,
          },
          "& .name-column--cell": {
            color: colors.white[100],
            fontFamily: 'Roboto, sans-serif',
            fontSize: 14,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.black[300],
            color: colors.white[100],
            borderBottom: "none",
            fontFamily: 'Roboto, sans-serif',
            fontSize: 14,
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
          rows={customer}
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
                        backgroundColor: selectionModel.length > 1 ? colors.redAccent[800] : colors.black[700],
                        color: selectionModel.length > 1 ? colors.white[100] : colors.white[100],
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
                    sx={{ ml: 2 }}
                    placeholder="Search by taxpayer name or pin"
                    value={searchQuery}
                    onChange={handleInputChange}

                  />
                  <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
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

          pagination
          pageSize={PAGE_SIZE}
          rowCount={totalPages ? totalPages * PAGE_SIZE : 0}

          onPageChange={handlePageChange}


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

export default Employee;









