import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DataTable from "./DataTable";
import Content from "../layout/Content";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MuiAlert from "@mui/material/Alert";
import { Transition } from "react-transition-group";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import AddDatadiri from "../datadiri/AddDatadiri";
import EditDatadiri from "../datadiri/EditDatadiri";
import InfoIcon from "@mui/icons-material/Info"

import "../style.css";

const columns = [
  { field: "id", headerName: "No", width: 30 },
  { field: "nama", headerName: "Nama", minWidth: 250 },
  { field: "email", headerName: "Email", minWidth: 350 },
  { field: "no_telp", headerName: "No.Telp", minWidth: 250 },
  { field: "actions", headerName: "Actions", minWidth: 250 },
];

const DatadiriTable = () => {
  const [datadiris, setDatadiri] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(true);
  const navigate = useNavigate();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [datadiriToDelete, setDatadiriToDelete] = useState(null);
  const [isAddDatadiriDialogOpen, setAddDatadiriDialogOpen] = useState(false);
  const [isEditDatadiriDialogOpen, setEditDatadiriDialogOpen] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);

  useEffect(() => {
    refreshToken();
    getDatadiri();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setDatadiri(decoded.nama);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
      }
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/login");
      }
    }
  };

const getDatadiri = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.get("http://localhost:5000/data_diri", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setDatadiri(dataWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
      setShowNoDataMessage(true);
    }
  };

  const [open] = React.useState(true);

  const handleShowDetail = (data) => {
    setSelectedData(data);
    setShowNoDataMessage(false);
  };

  const handleEditClick = (id) => {
    // Temukan data diri yang sesuai dengan ID yang diteruskan
    const dataToEdit = datadiris.find((data) => data.id === id);

    // Setel dataToEdit ke data diri yang ditemukan
    setDataToEdit(dataToEdit);

    // Buka dialog edit
    setEditDatadiriDialogOpen(true);
  };


  const handleDeleteClick = () => {
    setDatadiriToDelete();
    setDeleteConfirmationOpen(true);
  };
  
  const handleDetailClick = () => {
    navigate("/detail-datadiri")
  };

  const confirmDelete = () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      axios
        .delete(`http://localhost:5000/data_diri/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            // Datadiri is successfully deleted, show the snackbar
            handleSnackbarOpen();
            window.location.reload();
          } else {
            console.error("Gagal menghapus data.");
          }
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setDeleteConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setDatadiriToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleEditDatadiriClose = () => {
    // Menutup dialog edit
    setEditDatadiriDialogOpen(false);
    setDataToEdit(null); // Kosongkan `editId`
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddDatadiriClick = () => {
    setAddDatadiriDialogOpen(true);
  };

  const handleAddDatadiriClose = () => {
    setAddDatadiriDialogOpen(false);
  };

  const iconStyle = {
    fontSize: "40px", // Sesuaikan dengan ukuran yang Anda inginkan
    color: "black", // Sesuaikan dengan warna ikon Anda
    backgroundColor: "#ccc", // Warna abu-abu untuk latar belakang
    borderRadius: "50%", // Membuatnya menjadi lingkaran
    width: "60px", // Lebar total ikon (termasuk latar belakang)
    height: "60px", // Tinggi total ikon (termasuk latar belakang)
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Content open={open}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: 15 }}>Data Diri</h1>
      <Card>
        <CardContent>
          <Button variant="contained" color="success" sx={{ mb: 3 }} onClick={handleAddDatadiriClick}>
            Add New
          </Button>

          {datadiris && datadiris.length > 0 ? (
            <DataTable
              rows={datadiris}
              columns={columns.map((column) => ({
                ...column,
                renderCell: (params) => {
                  if (column.field === "actions") {
                    return (
                      <div>
                        <IconButton
                          aria-label="Edit"
                          color="primary"
                          onClick={() => handleEditClick(params.row.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          color="error"
                          onClick={() => handleDeleteClick(params.row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          color="primary"
                          onClick={() => handleDetailClick(params.row.id)}
                        >
                          <InfoIcon />
                        </IconButton>
                      </div>
                    );
                  } else if (column.field === "foto") {
                    return (
                      <img
                        src={params.value} // Anda harus menyediakan URL gambar dari data
                        alt="Foto"
                        style={{ width: 50, height: 50 }} // Sesuaikan dengan ukuran yang sesuai
                      />
                    );
                  } else {
                    return <span>{params.value}</span>;
                  }
                },
              }))}
            />
          ) : (
            <p>Data tidak tersedia atau sedang dimuat...</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteConfirmationOpen} onClose={cancelDelete} aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Konfirmasi Hapus Data Diri
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Apakah Anda yakin ingin menghapus data ini?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={cancelDelete}>
            Batal
          </Button>
          <Button onClick={confirmDelete} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Dialog */}

      <Transition in={isAddDatadiriDialogOpen} timeout={300} unmountOnExit>
        {(state) => (
          <Dialog open={isAddDatadiriDialogOpen} onClose={handleAddDatadiriClose}>
            <DialogTitle sx={{ display: "flex", marginTop: "10px", marginLeft: "10px", height: "110px" }}>
              <div style={iconStyle}>
                <PersonAddAltRoundedIcon />
              </div>
              <span style={{ fontSize: "24px", fontWeight: "bold", marginTop: "10px", marginLeft: "20px" }}> Add New Data Diri</span>
            </DialogTitle>
            <DialogContent sx={{ marginTop: "-30px" }}>
              <AddDatadiri onCancelAdd={handleAddDatadiriClose} onSuccess={getDatadiri} />
            </DialogContent>
          </Dialog>
        )}
      </Transition>

      <Transition in={isEditDatadiriDialogOpen} timeout={300} unmountOnExit>
        {(state) => (
          <Dialog open={isEditDatadiriDialogOpen} onClose={handleEditDatadiriClose}>
            <DialogTitle sx={{ display: "flex", marginTop: "10px", marginLeft: "10px", height: "110px" }}>
              <div style={iconStyle}>
                <PersonAddAltRoundedIcon />
              </div>
              <span style={{ fontSize: "24px", fontWeight: "bold", marginTop: "10px", marginLeft: "20px" }}>Update Data Datadiri</span>
            </DialogTitle>
            <DialogContent sx={{ marginTop: "-30px" }}>
              <EditDatadiri data={dataToEdit} onCancelAdd={handleEditDatadiriClose} onSuccess={getDatadiri} />
            </DialogContent>
          </Dialog>
        )}
      </Transition>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" severity="success" onClose={handleSnackbarClose}>
          Skill successfully deleted!
        </MuiAlert>
      </Snackbar>
    </Content>
  );
};

export default DatadiriTable;
