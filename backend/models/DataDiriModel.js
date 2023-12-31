import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import Pendidikan from "./PendidikanModel.js";
import Organisasi from "./OrganisasiModel.js";
import Skill from "./SkillModel.js";
import Portofolio from "./PortofolioModel.js";
import CustomUrl from "./CustomUrlModel.js";

const Data_diri = db.sequelize.define(
  "data_diri",
  {
    nama: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATEONLY,
    alamat: DataTypes.STRING,
    email: DataTypes.STRING,
    no_telp: DataTypes.STRING,
    foto: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    linkedin: DataTypes.STRING,
    instagram: DataTypes.STRING,
    x: DataTypes.STRING,
    github: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

// Hubungan
// ...

Data_diri.hasMany(Pendidikan, { as: "pendidikan" }, { foreignKey: "dataDiriId", onDelete: "CASCADE" });
Data_diri.hasMany(Organisasi, { as: "organisasi" }, { foreignKey: "dataDiriId", onDelete: "CASCADE" });
Data_diri.hasMany(Skill, { as: "skill" }, { foreignKey: "dataDiriId", onDelete: "CASCADE" });
Data_diri.hasMany(Portofolio, { as: "portofolio" }, { foreignKey: "dataDiriId", onDelete: "CASCADE" });
Data_diri.hasOne(CustomUrl, { foreignKey: "dataDiriId", onDelete: "CASCADE" });

Pendidikan.belongsTo(Data_diri);
Organisasi.belongsTo(Data_diri);
Portofolio.belongsTo(Data_diri);
Skill.belongsTo(Data_diri);

export default Data_diri;

(async () => {
  await db.sequelize.sync();
})();
