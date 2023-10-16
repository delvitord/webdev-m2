import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CardContent } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";

const AddSkill = ({ onCancelAdd, onSuccess }) => {
  const [nama_skill, setSkill] = useState("");
  const [level_keahlian, setLevelKeahlian] = useState(null);
  const [error, setError] = useState("");
  const [isCanceled, setIsCanceled] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const options = [
    { level_keahlian: "Pemula", id: 1 },
    { level_keahlian: "Menengah", id: 2 },
    { level_keahlian: "Ahli", id: 3 },
  ];

  const saveSkill = async (e) => {
    e.preventDefault();
    setError("");

    if (!isCanceled) {
      if (!nama_skill && !level_keahlian) {
        setError("Nama Skill dan Level Keahlian harus diisi");
      } else if (!nama_skill) {
        setError("Nama Skill harus diisi");
      } else if (!level_keahlian) {
        setError("Level Keahlian harus diisi");
      }
    }

    if (!isCanceled && (nama_skill || level_keahlian)) {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const formData = new FormData();
      formData.append("nama_skill", nama_skill);
      formData.append("level_keahlian", level_keahlian.id);

      try {
        await axios.post("http://localhost:5000/datadiri/skill", formData, {
          headers,
        });
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          onSuccess(); // Call the `onSuccess` function passed from SkillList
          onCancelAdd(); // Close the AddSkill dialog
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancel = () => {
    setIsCanceled(true);
    navigate("/navigasi");
  };

  return (
    <CardContent sx={{ minWidth: 500 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {showSuccessAlert && (
        <Alert severity="success" sx={{ marginBottom: 1 }}>
          Data Skill berhasil disimpan
        </Alert>
      )}
      <form onSubmit={saveSkill}>
        <TextField label="Nama Skill" fullWidth value={nama_skill} onChange={(e) => setSkill(e.target.value)} variant="outlined" margin="normal" />
        <Autocomplete
          id="level_keahlian"
          options={options}
          value={level_keahlian}
          onChange={(event, newValue) => setLevelKeahlian(newValue)}
          getOptionLabel={(option) => option.level_keahlian}
          renderInput={(params) => <TextField {...params} label="Level keahlian" sx={{ marginTop: 1 }} />}
        />
        <Grid container justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Save
          </Button>
          <Button variant="contained" color="error" sx={{ marginTop: 2, marginLeft: 1 }} onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </form>
    </CardContent>
  );
};

export default AddSkill;
