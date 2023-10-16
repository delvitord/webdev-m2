import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import Content from "../layout/Content";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddOrganisasi from "../organisasi/AddOrganisasii"; // Corrected typo
import EditOrganisasi from "../organisasi/EditOrganisasi";
import { Transition } from "react-transition-group";
import { useParams } from "react-router-dom";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import "../style.css";

const columns = [
  { field: "id", headerName: "No", width: 30 },
  { field: "nama_organisasi", headerName: "Nama Organisasi", minWidth: 100 },
  { field: "jabatan", headerName: "Jabatan", minWidth: 100 },
  { field: "awal_periode", headerName: "Awal Periode", minWidth: 100 },
  { field: "akhir_periode", headerName: "Akhir Periode", minWidth: 100 },
  { field: "deskripsi", headerName: "Deskripsi", minWidth: 100 },
  { field: "actions", headerName: "Actions", width: 150 },
];

const OrganisasiTable = () => {
  const [organisasi, setOrganisasi] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [organisasiToDelete, setOrganisasiToDelete] = useState(null);
  const [isAddOrganisasiDialogOpen, setAddOrganisasiDialogOpen] = useState(false);
  const [isEditOrganisasiDialogOpen, setEditOrganisasiDialogOpen] = useState(false);
  const [organisasiToEdit, setOrganisasiToEdit] = useState(null);

  useEffect(() => {
    refreshToken();
    getOrganisasi();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      const decoded = jwt_decode(response.data.accessToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Handle token expiration
        setExpire(decoded.exp);
      }
    } catch (error) {
      if (error.response) {
        navigate("/login");
      }
    }
  };

  const getOrganisasi = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/datadiri/organisasi", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
        _originalId: item.id,
      }));
      setOrganisasi(dataWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [open] = React.useState(true);
  const handleAddOrganisasiClick = () => {
    // Update the state to open the Add Organisasi dialog
    setAddOrganisasiDialogOpen(true);
  };
  // const handleEditClick = (originalId) => {
  //   navigate(`/edit-organisasi/${originalId}`);
  // };

  const handleEditOrganisasiClick = (id) => {
    const organisasiData = organisasi.find((item) => item._originalId === id);
    if (organisasiData) {
      console.log(organisasiData); // Add this line to debug
      setOrganisasiToEdit(organisasiData);
      // Update the state to open the Edit Organisasi dialog
      setEditOrganisasiDialogOpen(true);
    }
  };

  // Add a function to open the Edit Organisasi dialog with data

  const handleDeleteClick = (id) => {
    setOrganisasiToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    const id = organisasiToDelete;
    if (id) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        axios
          .delete(`http://localhost:5000/datadiri/organisasi/${id}`, {
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
    }
    setDeleteConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setOrganisasiToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEditOrganisasiClose = () => {
    setEditOrganisasiDialogOpen(false);
    setOrganisasiToEdit(null);
  };

  const { id } = useParams();
  const handleUpdateOrganisasi = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");
      // Lakukan permintaan axios untuk mengirim data perubahan ke server
      await axios.patch(`http://localhost:5000/datadiri/organisasi/${id}`, organisasi, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Setelah berhasil, Anda dapat melakukan navigasi kembali ke halaman "organisasi" atau tempat yang sesuai
      navigate("/organisasi");
    } catch (error) {
      console.log(error);
      // Anda dapat menambahkan penanganan kesalahan di sini, seperti menampilkan pesan kesalahan kepada pengguna.
    }
  };

  const handleAddOrganisasiClose = () => {
    setAddOrganisasiDialogOpen(false);
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
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: 15 }}>Pengalaman Organisasi</h1>
      <Card>
        <CardContent>
          <Button variant="contained" color="success" sx={{ mb: 3 }} onClick={handleAddOrganisasiClick}>
            Add New
          </Button>
          {organisasi && organisasi.length > 0 ? (
            <DataTable
              rows={organisasi}
              columns={columns.map((column) => ({
                ...column,
                renderCell: (params) => {
                  if (column.field === "actions") {
                    return (
                      <div>
                        <IconButton aria-label="Edit" color="primary" onClick={() => handleEditOrganisasiClick(params.row._originalId)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="Delete" color="error" onClick={() => handleDeleteClick(params.row._originalId)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    );
                  }
                },
              }))}
            />
          ) : (
            <p>Data tidak tersedia atau sedang dimuat...</p>
          )}
        </CardContent>
      </Card>

      <Transition in={isAddOrganisasiDialogOpen} timeout={300} unmountOnExit>
        {(state) => (
          <Dialog open={isAddOrganisasiDialogOpen} onClose={handleAddOrganisasiClose}>
            <DialogTitle sx={{ display: "flex", marginTop: "10px", marginLeft: "10px", height: "110px" }}>
              <div style={iconStyle}>
                <CorporateFareIcon />
              </div>
              <span style={{ fontSize: "24px", fontWeight: "bold", marginTop: "10px", marginLeft: "20px" }}>Add New Data Pengalaman Organisasi</span>
            </DialogTitle>
            <DialogContent sx={{ marginTop: "-30px" }}>
              <AddOrganisasi onCancelAdd={handleAddOrganisasiClose} onSuccess={getOrganisasi} />
            </DialogContent>
          </Dialog>
        )}
      </Transition>

      {/* Edit Organisasi Dialog */}
      <Transition in={isEditOrganisasiDialogOpen} timeout={300} unmountOnExit>
        {(state) => (
          <Dialog open={isEditOrganisasiDialogOpen} onClose={handleEditOrganisasiClose}>
            <DialogTitle>Edit Data Pengalaman Organisasi</DialogTitle>
            <DialogContent>
              <EditOrganisasi data={organisasiToEdit} onCancelEdit={handleEditOrganisasiClose} onSuccess={getOrganisasi} />
            </DialogContent>
          </Dialog>
        )}
      </Transition>
    </Content>
  );
};

export default OrganisasiTable;
