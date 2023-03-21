
import { filter } from 'lodash';
import { useState ,useEffect} from 'react';
import Swal from 'sweetalert2';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  // { id: 'id', label: 'ID', alignRight: false ,order:'ascending'},
  { id: 'pinNo', label: 'KRA pin', alignRight: false },
  { id: 'taxpayerName', label: 'taxPayer.N', alignRight: false },
  { id: 'suppliersName', label: 'suppliers.N', alignRight: false },
  { id: 'amntBeforeTax', label: 'AmountBeforeTax', alignRight: false },
  { id: 'purchTotal', label: 'purchTotal', alignRight: false },
 
 
  
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.taxpayerName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function VatPage() {

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customer, setCustomer] = useState([]);

  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customer.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 5));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  // function handleRowClick(data) {
  //   Swal.fire({
  //     title: `More details  for ${data.taxpayerName}`,
  //     html: `<p>ID: ${data.id},\nPin: ${data.pinNo},\nTax payer: ${data.taxpayerName},\nInvoice: ${data.invoiceNo}`,

  //   });
  // }
  function handleRowClick(data) {
    const styles = document.createElement('style');
    styles.innerHTML = '.swal2-container-custom-z-index { z-index: 9999 !important; }';
    document.head.appendChild(styles);
    
    Swal.fire({
      title: `More details for ${data.taxpayerName}`,
      html: `
        <div style="text-align: left;">
          <p><strong>trpFromDt:</strong> ${data.trpFromDt}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>trpToDt:</strong> ${data.trpToDt}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>suppliersPin:</strong> ${data.suppliersPin}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>Invoice:</strong> ${data.invoiceNo}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>invoiceDate:</strong> ${data.invoiceDate}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>custEntryNo:</strong> ${data.custEntryNo}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>lookupCode:</strong> ${data.lookupCode}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>createdDt:</strong> ${data.createdDt}</p>
        </div>
        <div style="text-align: left;">
          <p><strong>typeOfPurchases:</strong> ${data.typeOfPurchases}</p>
        </div>`,
      paddingTop:'20px',
      showCloseButton: true,
      customClass: {
        container: 'swal2-container-custom-z-index'
      },
      showConfirmButton: false,
    });
  }


  
 
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customer.length) : 0;

  const filteredUsers = applySortFilter(customer, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

//   useEffect(() => {
//     fetch("http://10.153.1.85:8080/api/falseImports")
//       .then((data) => data.json())
//       .then((data) => setCustomer(data))

//   }, []);
//   console.log(customer);

  useEffect(() => {
    fetch("http://10.153.1.85:8080/api/falseImports")
      .then(response => response.json())
      .then(json => setCustomer(json.content))
      .catch(error => console.error(error));
  }, []);
  console.log(customer)

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Customers
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={customer.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

        <TableBody>
        {applySortFilter(customer, getComparator(order, orderBy), filterName).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
        const isItemSelected = selected.indexOf(row.id) !== -1;
        const labelId = `table-checkbox-${index}`;
      return (
        <TableRow
          hover
          onClick={(event) => handleClick(event, row.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
          selected={isItemSelected}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={isItemSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </TableCell>
         
          {/* <TableCell>{row.id}</TableCell> */}
          <TableCell>{row.pinNo}</TableCell>
          <TableCell component="th" id={labelId} scope="row">
            {row.taxpayerName}
          </TableCell>
          <TableCell>{row.suppliersName}</TableCell>
          {/* <TableCell>{row.suppliersPin}</TableCell> */}
          <TableCell>{row.amntBeforeTax}</TableCell>
          <TableCell>{row.purchTotal}</TableCell>
        
         
          <TableCell>
            <Button  variant="contained" onClick={() => handleRowClick(row)}>view details</Button>
          </TableCell>
        </TableRow>
      );
       })}
       </TableBody>
                 {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 100, 1000000000000000000000000000000000000000000000000]}
            component="div"
            count={customer.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      
    </>
  );
}


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DataGrid } from 'react-data-grid';

// function DataGridTable() {
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const pageSize = 10; // number of items per page

//   useEffect(() => {
//     // Make API request to retrieve the first page of data
//     axios.get(`/api/data?page=${page}&pageSize=${pageSize}`)
//       .then(response => setData(response.data))
//       .catch(error => console.error(error));
//   }, [page]);

//   const handlePrevPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const handleNextPage = () => {
//     setPage(page + 1);
//   };

//   const columns = [
//     { key: 'column1', name: 'Column 1' },
//     { key: 'column2', name: 'Column 2' },
//     { key: 'column3', name: 'Column 3' },
//   ];

//   return (
//     <div>
//       <DataGrid
//         columns={columns}
//         rows={data}
//         rowKey="id"
//         pagination
//         paginationPageSize={pageSize}
//         paginationCurrentPage={page}
//         onPaginationChange={setPage}
//       />
//       <button onClick={handlePrevPage}>Prev Page</button>
//       <button onClick={handleNextPage}>Next Page</button>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { DataGrid } from 'react-data-grid';

// function DataGridTable() {
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const pageSize = 10; // number of items per page

//   useEffect(() => {
//     // Make API request to retrieve the first page of data
//     fetch(`/api/data?page=${page}&pageSize=${pageSize}`)
//       .then(response => response.json())
//       .then(json => setData(json))
//       .catch(error => console.error(error));
//   }, [page]);

//   const handlePrevPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const handleNextPage = () => {
//     setPage(page + 1);
//   };

//   const columns = [
//     { key: 'column1', name: 'Column 1' },
//     { key: 'column2', name: 'Column 2' },
//     { key: 'column3', name: 'Column 3' },
//   ];

//   return (
//     <div>
//       <DataGrid
//         columns={columns}
//         rows={data}
//         rowKey="id"
//         pagination
//         paginationPageSize={pageSize}
//         paginationCurrentPage={page}
//         onPaginationChange={setPage}
//       />
//       <button onClick={handlePrevPage}>Prev Page</button>
//       <button onClick={handleNextPage}>Next Page</button>
//     </div>
//   );
// }
