require("dotenv").config();
const { response } = require("express");
const { exec } = require("child_process");
const oracledb = require("oracledb");
const fs = require("fs");
const { stderr } = require("process");
const { connect } = require("http2");
const { create } = require("domain");

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

    return res.status(201).json({
      msg: "Tabla Temporal eliminada con éxito.",
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo eliminar la tabla Temporal.",
      err: error.message || JSON.stringify(error),
    });
  }
};

const createTemporal = async (req = request, res = response) => {
  try {
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
      msg: "Tabla Temporal creada desde cero con éxito.",
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo crear una nueva tabla Temporal.",
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

      console.log("El comando sqlldr se ha ejecutado sin problemas: " + stdout);

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

const deleteModelo = async (req = request, res = response) => {
  try {
    var dropConnect = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    await dropConnect.execute("DROP TABLE VictimaTratamiento");
    await dropConnect.execute("DROP TABLE VictimaAsociado");
    await dropConnect.execute("DROP TABLE VictimaHospital");
    await dropConnect.execute("DROP TABLE VictimaUbicacion");
    await dropConnect.execute("DROP TABLE VictimaVirus");
    await dropConnect.execute("DROP TABLE Hospital");
    await dropConnect.execute("DROP TABLE Tratamiento");
    await dropConnect.execute("DROP TABLE Ubicacion");
    await dropConnect.execute("DROP TABLE Contacto");
    await dropConnect.execute("DROP TABLE Asociado");
    await dropConnect.close();
    return res.status(201).json({
      msg: "Tablas del Modelo eliminadas correctamente.",
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo eliminar el Modelo.",
      err: error.message || JSON.stringify(error),
    });
  }
};

const createModelo = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    await createConnec.execute(`
    CREATE TABLE VictimaVirus (
            IdVictima NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            NombreVictima VARCHAR2(100) NULL,
            ApellidoVictima VARCHAR2(100) NULL,
            DireccionVictima VARCHAR2(200) NULL,
            FechaPrimeraSospecha DATE NULL,
            FechaConfirmacion DATE NULL,
            FechaMuerte DATE NULL,
            EstadoVictima VARCHAR2(100) NULL
        )`);

    await createConnec.execute(`
    CREATE TABLE Hospital(
        IdHospital NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        NombreHospital VARCHAR2(200) NULL,
        DireccionHospital VARCHAR2(200) NULL
    )`);

    await createConnec.execute(`
    CREATE TABLE Tratamiento(
        IdTratamiento NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        Tratamiento VARCHAR2(200) NULL,
        Efectividad INTEGER NULL
    )
    `);

    await createConnec.execute(`
    CREATE TABLE Ubicacion(
        IdUbicacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        Direccion VARCHAR2(200) NULL
    )
    `);

    await createConnec.execute(`
    CREATE TABLE Contacto(
        IdContacto NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        Tipo VARCHAR2(200) NULL
    )
    `);

    await createConnec.execute(`
    CREATE TABLE Asociado(
        IdAsociado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        NombreAsociado VARCHAR2(200) NULL,
        ApellidoAsociado VARCHAR2(200) NULL
    )
    `);

    await createConnec.execute(`
    CREATE TABLE VictimaTratamiento(
        IdVictimaTratamiento NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        EfectividadVictima INTEGER NULL,
        FechaInicioTratamiento DATE NULL,
        FechaFinTratamiento DATE NULL,
        IdVictima NUMBER(10),
        IdTratamiento NUMBER(10),
        
        FOREIGN KEY (IdVictima) REFERENCES VictimaVirus(IdVictima),
        FOREIGN KEY (IdTratamiento) REFERENCES Tratamiento(IdTratamiento)
    )
    `);

    await createConnec.execute(`
    CREATE TABLE VictimaAsociado(
        IdVictimaAsociado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        FechaConocido DATE,
        FechaInicioContacto DATE,
        FechaFinContacto DATE,
        IdVictima NUMBER(10) NULL,
        IdAsociado NUMBER(10) NULL,
        IdContacto NUMBER(10) NULL,
        
        FOREIGN KEY (IdVictima) REFERENCES VictimaVirus(IdVictima),
        FOREIGN KEY (IdAsociado) REFERENCES Asociado(IdAsociado),
        FOREIGN KEY (IdContacto) REFERENCES Contacto(IdContacto)
    )
    `);

    await createConnec.execute(`
    CREATE TABLE VictimaHospital(
        IdVictimaHospital NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        FechaLlegada DATE,
        FechaRetiro DATE,
        IdVictima NUMBER(10),
        IdHospital NUMBER(10),
        
        FOREIGN KEY (IdVictima) REFERENCES VictimaVirus(IdVictima),
        FOREIGN KEY (IdHospital) REFERENCES Hospital(IdHospital)
    )
    `);

    await createConnec.execute(`
    CREATE TABLE VictimaUbicacion(
        IdVictimaUbicacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        IdVictima NUMBER(10) NULL,
        IdUbicacion NUMBER(10) NULL,
        
        FOREIGN KEY (IdVictima) REFERENCES VictimaVirus(IdVictima),
        FOREIGN KEY (IdUbicacion) REFERENCES Ubicacion(IdUbicacion)
    )
    `);

    await createConnec.close();
    return res.status(201).json({
      msg: "Tablas del Modelo creadas correctamente.",
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo crear el Modelo.",
      err: error.message || JSON.stringify(error),
    });
  }
};

const insertModelo = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    await createConnec.execute(`
    INSERT INTO VictimaVirus (NombreVictima, ApellidoVictima, DireccionVictima, FechaPrimeraSospecha, FechaConfirmacion, FechaMuerte, EstadoVictima)
    SELECT DISTINCT t.NombreVictima , t.ApellidoVictima ,t.DireccionVictima ,t.FechaPrimeraSospecha , t.FechaConfirmacion , t.FechaMuerte , t.EstadoVictima 
    FROM Temporal t WHERE t.NombreVictima IS NOT NULL AND t.ApellidoVictima  IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO Tratamiento (Tratamiento, Efectividad)
    SELECT DISTINCT t.Tratamiento , t.Efectividad 
    FROM Temporal t WHERE T.Tratamiento IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO Contacto (Contacto.Tipo)
    SELECT DISTINCT T.ContactoFisico FROM Temporal t 
    WHERE T.ContactoFisico IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO Ubicacion (Direccion)
    SELECT DISTINCT T.UbicacionVictima FROM Temporal t  WHERE T.UbicacionVictima IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO Asociado (NombreAsociado, ApellidoAsociado)
    SELECT DISTINCT t.NombreAsociado, t.ApellidoAsociado FROM Temporal t
    WHERE t.NombreAsociado IS NOT NULL AND t.ApellidoAsociado IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO Hospital (NombreHospital, DireccionHospital)
    SELECT DISTINCT t.NombreHospital, t.DireccionHospital  
    FROM Temporal t WHERE t.NombreHospital IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO VictimaTratamiento (EfectividadVictima, FechaInicioTratamiento, FechaFinTratamiento, IdVictima, IdTratamiento)
    SELECT DISTINCT T.EfectividadEnVictima , T.FechaInicioTratamiento, T.FechaFinTratamiento, VV.IdVictima , T2.IdTratamiento FROM Temporal t 
    JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima AND T.ApellidoVictima = VV.ApellidoVictima
    JOIN Tratamiento t2 ON T2.Tratamiento = T.Tratamiento`);

    await createConnec.execute(`
    INSERT INTO VictimaHospital (FechaLlegada, FechaRetiro, IdVictima, IdHospital)
    SELECT DISTINCT T.FechaLlegada ,T.FechaRetiro, VV.IdVictima , H.IdHospital   FROM Temporal t 
    JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima  AND T.ApellidoVictima = VV.ApellidoVictima
    JOIN Hospital h ON T.NombreHospital = H.NombreHospital 
    WHERE T.FechaLlegada IS NOT NULL AND T.FechaRetiro IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO VictimaAsociado va (va.IdVictima, va.IdAsociado, va.FechaConocido, va.FechaInicioContacto, va.FechaFinContacto)
    SELECT DISTINCT VV.IdVictima, A.IdAsociado, T.FechaConocido, T.FechaInicioContacto, T.FechaFinContacto FROM Temporal t 
    JOIN Asociado a ON T.NombreAsociado = A.NombreAsociado AND T.ApellidoAsociado = A.ApellidoAsociado 
    JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima AND T.ApellidoVictima = VV.ApellidoVictima
    JOIN Contacto c ON C.Tipo = T.ContactoFisico
    WHERE T.FechaConocido IS NOT NULL  AND T.FechaInicioContacto IS NOT NULL AND T.FechaFinContacto IS NOT NULL`);

    await createConnec.execute(`
    INSERT INTO VictimaUbicacion vu (vu.IdVictima, vu.IdUbicacion)
    SELECT DISTINCT vv.IdVictima, u.IdUbicacion  FROM Temporal t 
    JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima  AND T.ApellidoVictima = VV.ApellidoVictima
    JOIN Ubicacion u ON u.Direccion = t.UbicacionVictima`);

    await createConnec.close();
    return res.status(201).json({
      msg: "Inserción de Datos de la tabla Temporal al Modelo correcto.",
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "No se pudo insertar datos de la tabla Temporal al resto del Modelo.",
      err: error.message || JSON.stringify(error),
    });
  }
};

module.exports = {
  deleteTemporal,
  createTemporal,
  insertTemporal,
  deleteModelo,
  createModelo,
  insertModelo,
};
