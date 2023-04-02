import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const Graph = (props) => {
  const [owners, setOwners] = useState([]);
  const [falseImports, setFalseImports] = useState([]);

  useEffect(() => {
    fetch(`http://10.153.1.85:8000/fraud_app/api/v1/owner_and_false_imports/${props.pinNo}/`)
      .then(response => response.json())
      .then(data => {
        const parsedOwners = JSON.parse(data.owners);
        setOwners(parsedOwners);
        const parsedFalseImports = JSON.parse(data.false_imports);
        setFalseImports(parsedFalseImports);
      })
      .catch(error => console.error(error));
  }, [props.pinNo]);

  const ownersColumns = [
    { field: "tax_payer_name", headerName: "Name", width: 200 },
    { field: "pin_no", headerName: "PIN No", width: 150 },
    { field: "associated_entity_type", headerName: "Associated Entity Type", width: 250 },
    { field: "associated_entity_pin", headerName: "Associated Entity PIN", width: 200 }
  ];

  const falseImportsColumns = [
    { field: "cust_entry_no_prn", headerName: "Cust Entry No PRN", width: 250 },
    { field: "invoice_no", headerName: "Invoice No", width: 150 },
    { field: "lookup_code", headerName: "Lookup Code", width: 200 },
    { field: "suppliers_name", headerName: "Suppliers Name", width: 250 },
    { field: "invoice_date", headerName: "Invoice Date", width: 150 }
  ];

  return (
    <div>
      <h2>Owners</h2>
      <DataGrid rows={owners} columns={ownersColumns} pageSize={10} />
      <h2>False Imports</h2>
      <DataGrid rows={falseImports} columns={falseImportsColumns} pageSize={10} />
    </div>
  );
}
export default Graph;
