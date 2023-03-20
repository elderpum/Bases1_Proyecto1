require("dotenv").config();
const { response } = require("express");
const { exec } = require("child_process");
const oracledb = require("oracledb");
const fs = require("fs");
const { stderr } = require("process");

const ctlFile = process.env.CARGACTL;
const username = process.env.ORACLEDBUSERNAME;
const password = process.env.ORACLEDBPASSWORD;
const connection = process.env.ORACLEDBCONNECTION;
const commandSqlldr = process.env.SQLLDRCOMMAND;

oracledb.autoCommit = true;

// Delete Temporal and create a new one with 0 information inside
const deleteTemporal = async (req = request, res = response) => {
  try {
    // Drop Table script
    var dropConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    await dropConnec.execute(`DROP TABLE Temporal`);
    await dropConnec.close();

    // Create Table script
    var createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    await createConnec.execute(`
        CREATE TABLE Temporal(
            NombreVictima VARCHAR2(200),
            ApellidoVictima VARCHAR2(200),
            DireccionVictima VARCHAR2(200),
            FechaPrimeraSospecha DATE,
            FechaConfirmacion DATE,
            FechaMuerte DATE,
            EstadoVictima VARCHAR2(200),
            NombreAsociado VARCHAR2(200),
            ApellidoAsociado VARCHAR2(200),
            FechaConocido DATE,
            ContactoFisico VARCHAR2(200),
            FechaInicioContacto DATE,
            FechaFinContacto DATE,
            NombreHospital VARCHAR2(200),
            DireccionHospital VARCHAR2(200),
            UbicacionVictima VARCHAR2(200),
            FechaLlegada DATE,
            FechaRetiro DATE,
            Tratamiento VARCHAR2(200),
            Efectividad NUMBER,
            FechaInicioTratamiento DATE,
            FechaFinTratamiento DATE,
            EfectividadEnVictima NUMBER
        )
        `);
    await createConnec.close();
    return res.status(201).json({
      msg: "Tabla Temporal eliminada y creada desde cero con éxito.",
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo eliminar y crear una nueva tabla Temporal.",
      err: error.message || JSON.stringify(error),
    });
  }
};

const insertTemporal = async (req = request, res = response) => {
  try {
    const sqlldr = commandSqlldr;

    exec(sqlldr, (error, stdout, stderr) => {
      if (error) {
        console.error(error.message || JSON.stringify(error));
        return res.status(401).json({
          msg: "Error al ejecutar el comando sqlldr.",
          err: error.message || JSON.stringify(error),
        });
      }

      if (stderr) {
        console.error(stderr || JSON.stringify(stderr));
        return res.status(401).json({
          msg: "Error al ejecutar el comando sqlldr.",
          err: stderr || JSON.stringify(stderr),
        });
      }

      console.log("El comando sqlldr se ha ejecutado sin problemas: " + stdout)

      return res.status(201).json({
        msg: "Carga masiva en la tabla Temporal cargado correctamente.",
      });
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo hacer la carga masiva.",
      err: error.message || JSON.stringify(error),
    });
  }
};

module.exports = {
  deleteTemporal,
  insertTemporal,
};
