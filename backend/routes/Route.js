import express from "express";
import { createData_diri, deleteData_diri, getData_diri, getData_diriById, updateData_diri } from "../controllers/DataDiriController.js";
import { createPendidikan, deletePendidikan, getPendidikan, getPendidikanById, updatePendidikan } from "../controllers/PendidikanController.js";
import { createSkill, deleteSkill, getSkill, getSkillById, updateSkill } from "../controllers/SkillController.js";
import { createGaleri, deleteGaleri, getGaleri, getGaleriById, updateGaleri } from "../controllers/GaleriController.js";
import { Login, Logout, Register, getAccount } from "../controllers/AccountController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// CRUD DATA DIRI
router.get("/data_diri", getData_diri);
router.get("/data_diri/:id", getData_diriById);
router.post("/data_diri", createData_diri);
router.patch("/data_diri:id", updateData_diri);
router.delete("/data_diri:id", deleteData_diri);

// CRUD PENDIDIKAN
router.get("/pendidikan", getPendidikan);
router.get("/pendidikan/:id", getPendidikanById);
router.post("/pendidikan", createPendidikan);
router.patch("/pendidikan:id", updatePendidikan);
router.delete("/pendidikan:id", deletePendidikan);

// LOGIN
router.get("/admin", verifyToken, getAccount);
router.post("/admin", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

// SKILL
router.get("/skill", getSkill);
router.get("/skill/:id", getSkillById);
router.post("/skill", createSkill);
router.patch("/skill/:id", updateSkill);
router.delete("/skill/:id", deleteSkill);

// GALERI
router.get("/galeri", getGaleri);
router.get("/galeri/:id", getGaleriById);
router.post("/galeri", createGaleri);
router.patch("/galeri/:id", updateGaleri);
router.delete("/galeri/:id", deleteGaleri);

export default router;
