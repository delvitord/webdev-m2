import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import  Box  from "@mui/material/Box";
import Card from "@mui/material/Card"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import { CardContent } from "@mui/material";

const columns = [
  { id: "nama", label: "Nama", minWidth: 100 },
  { id: "tempat_lahir", label: "Tempat Lahir", minWidth: 100 },
  { id: "tanggal_lahir", label: "Tanggal Lahir", minWidth: 100 },
  { id: "alamat", label: "Alamat", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "no_telp", label: "No.Telp", minWidth: 100 },
  { id: "foto", label: "Foto", minWidth: 100 },
  { id: "deskripsi", label: "Deskripsi", minWidth: 100 },
  { id: "linkedin", label: "LinkedIn", minWidth: 100 },
  { id: "instagram", label: "Instagram", minWidth: 100 },
  { id: "x", label: "X", minWidth: 100 },
  { id: "github", label: "GitHub", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

const DatadiriList = () => {
  const [datadiris, setDatadiri] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getDatadiri();
  }, []);

  const getDatadiri = async () => {
    const response = await axios.get("http://localhost:5000/data_diri");
    setDatadiri(response.data);
    console.log(response.data)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <Box height={100}/>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Card>
            <CardContent>
              <Link to={`/add-datadiri`}>
                <Button variant="contained" color="success">
                  Add New
                </Button>
              </Link>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="left"
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datadiris
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((data_diri, index) => (
                          <TableRow key={data_diri.id}>
                            {columns.map((column) => {
                              const value = data_diri[column.id];
                              return (
                                <TableCell key={index + 1} align="left">
                                  {column.id === "actions" ? (
                                    <Link to={`/edit/${data_diri.id}`}>
                                      <Button
                                        variant="contained"
                                        color="info"
                                        size="small"
                                      >
                                        Edit
                                      </Button>
                                    </Link>
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={datadiris.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default DatadiriList;
