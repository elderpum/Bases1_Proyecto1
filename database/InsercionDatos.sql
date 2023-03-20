--Vamos a insertar los datos de la tabla Temporal al resto de tablas de la base de datos
-- Insercion de VictimaVirus - 1000 inserciones
INSERT INTO VictimaVirus (NombreVictima, ApellidoVictima, DireccionVictima, FechaPrimeraSospecha, FechaConfirmacion, FechaMuerte, EstadoVictima)
SELECT DISTINCT t.NombreVictima , t.ApellidoVictima ,t.DireccionVictima ,t.FechaPrimeraSospecha , t.FechaConfirmacion , t.FechaMuerte , t.EstadoVictima 
FROM Temporal t WHERE t.NombreVictima IS NOT NULL AND t.ApellidoVictima  IS NOT NULL;

-- Insercion de Tratamiento - 5 inserciones
INSERT INTO Tratamiento (Tratamiento, Efectividad)
SELECT DISTINCT t.Tratamiento , t.Efectividad 
FROM Temporal t WHERE T.Tratamiento IS NOT NULL;

-- Insercion de Contactos - 8 inserciones
INSERT INTO Contacto (Contacto.Tipo)
SELECT DISTINCT T.ContactoFisico FROM Temporal t 
WHERE T.ContactoFisico IS NOT NULL;

-- Insercion de Ubicacion - 120 inserciones
INSERT INTO Ubicacion (Direccion)
SELECT DISTINCT T.UbicacionVictima FROM Temporal t  WHERE T.UbicacionVictima IS NOT NULL;

-- Insercion de Asociados - 500 inserciones
INSERT INTO Asociado (NombreAsociado, ApellidoAsociado)
SELECT DISTINCT t.NombreAsociado, t.ApellidoAsociado FROM Temporal t
WHERE t.NombreAsociado IS NOT NULL AND t.ApellidoAsociado IS NOT NULL;

-- Insercion de Hospitales - 80 inserciones
INSERT INTO Hospital (NombreHospital, DireccionHospital)
SELECT DISTINCT t.NombreHospital, t.DireccionHospital  
FROM Temporal t WHERE t.NombreHospital IS NOT NULL;

-- Insercion de VictimaTratamiento - 567 inserciones
INSERT INTO VictimaTratamiento (EfectividadVictima, FechaInicioTratamiento, FechaFinTratamiento, IdVictima, IdTratamiento)
SELECT DISTINCT T.EfectividadEnVictima , T.FechaInicioTratamiento, T.FechaFinTratamiento, VV.IdVictima , T2.IdTratamiento FROM Temporal t 
JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima AND T.ApellidoVictima = VV.ApellidoVictima
JOIN Tratamiento t2 ON T2.Tratamiento = T.Tratamiento;

-- Insercion de VictimaHospital - 340 inserciones
INSERT INTO VictimaHospital (FechaLlegada, FechaRetiro, IdVictima, IdHospital)
SELECT DISTINCT T.FechaLlegada ,T.FechaRetiro, VV.IdVictima , H.IdHospital   FROM Temporal t 
JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima  AND T.ApellidoVictima = VV.ApellidoVictima
JOIN Hospital h ON T.NombreHospital = H.NombreHospital 
WHERE T.FechaLlegada IS NOT NULL AND T.FechaRetiro IS NOT NULL;

-- Insercion de VictimaAsociado - 7280 inserciones
INSERT INTO VictimaAsociado va (va.IdVictima, va.IdAsociado, va.FechaConocido, va.FechaInicioContacto, va.FechaFinContacto)
SELECT DISTINCT VV.IdVictima, A.IdAsociado, T.FechaConocido, T.FechaInicioContacto, T.FechaFinContacto FROM Temporal t 
JOIN Asociado a ON T.NombreAsociado = A.NombreAsociado AND T.ApellidoAsociado = A.ApellidoAsociado 
JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima AND T.ApellidoVictima = VV.ApellidoVictima
JOIN Contacto c ON C.Tipo = T.ContactoFisico
WHERE T.FechaConocido IS NOT NULL  AND T.FechaInicioContacto IS NOT NULL AND T.FechaFinContacto IS NOT NULL;

-- Insercion de VictimaUbicacion - 941 inserciones
INSERT INTO VictimaUbicacion vu (vu.IdVictima, vu.IdUbicacion)
SELECT DISTINCT vv.IdVictima, u.IdUbicacion  FROM Temporal t 
JOIN VictimaVirus vv ON T.NombreVictima = VV.NombreVictima  AND T.ApellidoVictima = VV.ApellidoVictima
JOIN Ubicacion u ON u.Direccion = t.UbicacionVictima;