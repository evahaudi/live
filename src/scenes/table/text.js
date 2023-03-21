import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';

import Header from '../../components/Header';

const Table = () => {
  const [customer, setCustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPinNo, setSelectedPinNo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiData, setApiData] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getFilteredRows = () => {
    return customer.filter(
      (row) =>
        row.pinNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.taxpayerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAssociatePin = (pinNo) => {
    setSelectedPinNo(pinNo);
  };

  const associatePin = () => {
    fetch(`http://10.153.1.85:8081/api/directorDetails?pinNo=${selectedPinNo}`)
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setDialogOpen(true);
      })
      .catch((error) => console.error(error));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setApiData(null);
  };

  const columns = [
    {
      field: 'pinNo',
      headerName: 'KRA PIN No.',
      headerAlign: 'left',
      fontSize: 40,
      width: 130
    },
    {
      field: 'taxpayerName',
      headerName: 'TAXPAYER NAME',
      headerAlign: 'left',
      fontSize: 40,
      width: 200
    },
    {
      field: 'suppliersName',
      headerName: 'SUPPLIER NAME',
      headerAlign: 'left',
      fontSize: 16,
      width: 250
    },
    {
      field: 'purchTotal',
      headerName: 'TOTAL PURCHASE',
      type: 'number',
      headerAlign: 'left',
      fontSize: 16,
      width: 150
    },
    { field: 'trpFromDt', headerName: 'trpFromDt', headerAlign: 'left', fontSize: 16, width: 100 },
    { field: 'trpToDt', headerName: 'trpToDt', headerAlign: 'left', fontSize: 16, width: 100 },
    { field: 'invoiceNo', headerName: 'INVOICENO.', headerAlign: 'left', fontSize: 16, width: 150 },
    { field: 'invoiceAmt', headerName: 'INVOICE AMOUNT', type: 'number', headerAlign: 'left', fontSize: 16, width: 150 },
    { field: 'taxableAmt', headerName: 'TAXABLE AMOUNT', type: 'number', headerAlign: 'left', fontSize: 16, width: 150 },
    { field: 'vatAmt', headerName: 'VAT AMOUNT', type: 'number', headerAlign: 'left', fontSize: 16, width: 150 },
    { field: 'withholdingTaxAmt', headerName: 'WITHHOLDING TAX', type: 'number', headerAlign: 'left', fontSize: 16, width: 150 },
    {
    field: 'action',
    headerName: 'ACTION',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    width: 150,
    renderCell: (params) => (
    <IconButton onClick={() => handleAssociatePin(params.row.pinNo)}>
    <SearchIcon fontSize="small" />
    </IconButton>
    )
    }
    ];
    
    useEffect(() => {
    const fetchData = async () => {
    try {
    const response = await fetch('http://10.153.1.85:8081/api/customer');
    const data = await response.json();
    setCustomer(data);
    } catch (error) {
    console.error(error);
    }
    };
    fetchData();
    }, []);
    
    return (
    <>
    <Header title="Customer Table" />
    <Box sx={{ pb: 2 }}>
    <Typography variant="h4" sx={{ fontWeight: 600 }}>
    CUSTOMER TABLE
    </Typography>
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
    <SearchIcon sx={{ color: colors.gray[500], mr: 1 }} />
    <InputBase
    placeholder="Search by KRA PIN No. or Taxpayer Name"
    value={searchQuery}
    onChange={handleInputChange}
    sx={{ flexGrow: 1 }}
    />
    <Button variant="contained" sx={{ ml: 1 }} onClick={associatePin} disabled={!selectedPinNo}>
    Associate Pin
    </Button>
    </Box>
    </Box>
    <div style={{ height: 600, width: '100%' }}>
    <DataGrid
    rows={getFilteredRows()}
    columns={columns}
    pageSize={10}
    rowsPerPageOptions={[10, 25, 50]}
    components={{ Toolbar: GridToolbar }}
    disableSelectionOnClick
    />
    </div>
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
    <DialogTitle>Director Details</DialogTitle>
    <DialogContent>
    {apiData ? (
    <>
    <DialogContentText>
    Name: {apiData.name}, Email: {apiData.email}
    </DialogContentText>
    <DialogContentText>
    Phone: {apiData.phone}, Address: {apiData.address}
    </DialogContentText>
    </>
    ) : (
    <DialogContentText>No data found</DialogContentText>
    )}
    </DialogContent>
    <DialogActions>
    <Button onClick={handleCloseDialog}>Close</Button>
    </DialogActions>
    </Dialog>
    </>
    );
    };
    
    export default Table;
