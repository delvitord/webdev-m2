import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import Content from "../layout/Content";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const columns = [
  { field: "id", headerName: "No", minWidth: 30 },
  { field: "nama_skill", headerName: "Nama Skill", minWidth: 250 },
  { field: "level_keahlian", headerName: "Level Keahlian", minWidth: 200 },
  { field: "actions", headerName: "Actions", minWidth: 100 },
];

const SkillTable = () => {
  const [skill, setSkill] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getSkill();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setPendidikan(decoded.nama);
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

  const getSkill = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.get("http://localhost:5000/datadiri/skill", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
        _originalId: item.id,
      }));
      setPendidikan(dataWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [open] = React.useState(true);
  const handleEditClick = (originalId) => {
    // Navigasi ke halaman edit dengan mengirimkan ID data sebagai bagian dari URL
    navigate(`/edit-skill/${originalId}`);
  };

  const handleDeleteClick = async (originalId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        // Lakukan permintaan DELETE ke backend untuk menghapus data dengan ID tertentu
        axios.delete(`http://localhost:5000/skill/${originalId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  return (
    <Content open={open}>
      <Link to={`/add-skill`}>
        <Button variant="contained" color="success" sx={{ mb: 3 }}>
          Add New
        </Button>
      </Link>
      {pendidikan && pendidikan.length > 0 ? (
        <DataTable
          rows={pendidikan}
          columns={columns.map((column) => ({
            ...column,
            renderCell: (params) => {
              if (column.field === "actions") {
                return (
                  <div>
                    <IconButton aria-label="Edit" color="primary" onClick={() => handleEditClick(params.row._originalId)}>
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
    </Content>
  );
};

export default SkillTable;
