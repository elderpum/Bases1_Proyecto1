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

const consulta1 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT h.NombreHospital, h.DireccionHospital, COUNT(vh.FechaRetiro) AS NumeroFallecidos
    FROM Hospital h
    LEFT JOIN VictimaHospital vh ON h.IdHospital = vh.IdHospital
    WHERE vh.FechaRetiro IS NOT NULL
    GROUP BY h.IdHospital, h.NombreHospital, h.DireccionHospital
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #1 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #1",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta2 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT VV.NombreVictima, VV.ApellidoVictima FROM VictimaVirus vv 
    JOIN VictimaTratamiento vt ON VV.IdVictima = VT.IdVictima 
    JOIN Tratamiento t ON T.IdTratamiento = VT.IdTratamiento
    WHERE VT.EfectividadVictima > 5 AND VT.IdTratamiento = 2
    ORDER BY vv.NombreVictima ASC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #2 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #2",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta3 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT DISTINCT VV.NombreVictima , VV.ApellidoVictima, vv.DireccionVictima, COUNT(VA.IdVictima) AS Asociados FROM VictimaVirus vv 
    JOIN VictimaAsociado va ON VV.IdVictima = VA.IdVictima  
    WHERE vv.FechaMuerte IS NOT NULL 
    GROUP BY VA.IdVictima, VV.NombreVictima, VV.ApellidoVictima, vv.DireccionVictima
    HAVING COUNT (VA.IdVictima) > 3
    ORDER BY Asociados DESC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #3 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #3",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta4 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT DISTINCT vv.NombreVictima, vv.ApellidoVictima FROM VictimaVirus vv
    JOIN VictimaAsociado va ON va.IdVictima = vv.IdVictima
    JOIN Contacto c ON c.IdContacto = va.IdContacto
    WHERE c.Tipo = 'Beso' AND vv.EstadoVictima = 'Suspendida'
    GROUP BY vv.NombreVictima, vv.ApellidoVictima
    HAVING COUNT(DISTINCT va.IdAsociado) > 2
    ORDER BY vv.NombreVictima ASC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #4 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #4",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta5 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT DISTINCT vv.NombreVictima, vv.ApellidoVictima, COUNT(vt.IdVictima) AS Tratamientos FROM VictimaVirus vv
    JOIN VictimaTratamiento vt ON vt.IdVictima = vv.IdVictima
    JOIN Tratamiento t ON t.IdTratamiento = vt.IdTratamiento
    WHERE t.Tratamiento = 'Oxigeno'
    GROUP BY vt.IdVictima, vv.NombreVictima, vv.ApellidoVictima
    ORDER BY Tratamientos DESC, vv.NombreVictima ASC
    FETCH FIRST 5 ROWS ONLY
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #5 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #5",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta6 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT vv.NombreVictima, vv.ApellidoVictima, vv.FechaMuerte FROM VictimaVirus vv 
    JOIN VictimaTratamiento vt ON vt.IdVictima = vv.IdVictima 
    JOIN VictimaUbicacion vu ON vu.IdVictima = vv.IdVictima 
    JOIN Ubicacion u ON u.IdUbicacion = vu.IdUbicacion 
    JOIN Tratamiento t ON t.IdTratamiento = vt.IdTratamiento 
    WHERE u.Direccion = '1987 Delphine Well' AND t.Tratamiento = 'Manejo de la presion arterial'
    ORDER BY vv.NombreVictima, vv.ApellidoVictima ASC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #6 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #6",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta7 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT DISTINCT VV.NombreVictima, VV.ApellidoVictima, VV.DireccionVictima, COUNT(DISTINCT VT.IdTratamiento) AS Tratamientos
    FROM VictimaVirus vv
    JOIN VictimaTratamiento vt ON VV.IdVictima = VT.IdVictima 
    GROUP BY VV.IdVictima, VV.NombreVictima, VV.ApellidoVictima, VV.DireccionVictima
    HAVING COUNT(DISTINCT VT.IdTratamiento) = 2
    ORDER BY vv.NombreVictima, vv.ApellidoVictima ASC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #7 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #7",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta8 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT VV.NombreVictima, VV.ApellidoVictima, EXTRACT(MONTH FROM VV.FechaPrimeraSospecha) AS MES_SOS, COUNT(VT.IdTratamiento) AS NUM_TRAT
    FROM VictimaVirus vv 
    JOIN VictimaTratamiento vt ON VT.IdVictima = VV.IdVictima
    GROUP BY VV.NombreVictima, VV.ApellidoVictima, EXTRACT(MONTH FROM VV.FechaPrimeraSospecha) 
    HAVING COUNT(*) = (
    SELECT MAX(NUM_TRAT)
    FROM ( 
	    SELECT COUNT(*) AS NUM_TRAT 
	    FROM VictimaVirus vv2 
	    JOIN VictimaTratamiento vt2 ON VV2.IdVictima = VT2.IdVictima 
	    GROUP BY VV2.NombreVictima, VV2.ApellidoVictima 
    )
    ) UNION 
    SELECT vv3.NombreVictima, vv3.ApellidoVictima, EXTRACT (MONTH FROM vv3.FechaPrimeraSospecha) AS MES_SOS, COUNT(VT3.IdTratamiento) AS NUM_TRAT 
    FROM VictimaVirus vv3 
    JOIN VictimaTratamiento vt3 ON VT3.IdVictima = VV3.IdVictima
    GROUP BY VV3.NombreVictima, VV3.ApellidoVictima, EXTRACT(MONTH FROM VV3.FechaPrimeraSospecha)
    HAVING COUNT(*) = (
    SELECT MIN(NUM_TRAT)
    FROM(
	    SELECT COUNT(*) AS NUM_TRAT 
	    FROM VictimaVirus vv3 
	    JOIN VictimaTratamiento vt4 ON VV3.IdVictima = VT4.IdVictima 
	    GROUP BY VV3.NombreVictima, VV3.ApellidoVictima 
    )

    )ORDER BY NUM_TRAT DESC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #8 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #8",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta9 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT h.NombreHospital, (Count(vv.IdVictima)/(SELECT COUNT(*) FROM VictimaHospital))*100 AS Porcentaje 
    FROM VictimaVirus vv 
    JOIN VictimaHospital vh ON vv.IdVictima = vh.IdVictima 
    JOIN Hospital h ON vh.IdHospital = h.IdHospital 
    GROUP BY h.NombreHospital
    ORDER BY Porcentaje DESC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #9 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #9",
      err: error.message || JSON.stringify(error),
    });
  }
};

const consulta10 = async (req = request, res = response) => {
  try {
    createConnec = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: connection,
    });

    const result = await createConnec.execute(`
    SELECT h.NombreHospital, c.Tipo AS NombreContacto, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM VictimaHospital vh2 WHERE vh2.IdHospital = h.IdHospital) AS PorcentajeVictimas
    FROM VictimaHospital vh
    JOIN Hospital h ON vh.IdHospital = h.IdHospital
    JOIN VictimaAsociado va ON vh.IdVictima = va.IdVictima
    JOIN Contacto c ON va.IdContacto = c.IdContacto
    GROUP BY h.IdHospital, c.Tipo, h.NombreHospital
    ORDER BY h.NombreHospital, PorcentajeVictimas DESC
    `);
    await createConnec.close();

    return res.status(201).json({
      msg: "Consulta #10 realizada con éxito",
      resultado: result,
    });
  } catch (error) {
    console.error(error.message || JSON.stringify(error));
    return res.status(401).json({
      msg: "Error al realizar la consulta #10",
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
  consulta1,
  consulta2,
  consulta3,
  consulta4,
  consulta5,
  consulta6,
  consulta7,
  consulta8,
  consulta9,
  consulta10,
};
