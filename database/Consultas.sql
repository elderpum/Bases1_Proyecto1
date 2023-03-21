-- Consulta 1
SELECT h.NombreHospital, h.DireccionHospital, COUNT(vh.FechaRetiro) AS NumeroFallecidos
FROM Hospital h
LEFT JOIN VictimaHospital vh ON h.IdHospital = vh.IdHospital
WHERE vh.FechaRetiro IS NOT NULL
GROUP BY h.IdHospital, h.NombreHospital, h.DireccionHospital;

-- Consulta 2
SELECT VV.NombreVictima, VV.ApellidoVictima FROM VictimaVirus vv 
JOIN VictimaTratamiento vt ON VV.IdVictima = VT.IdVictima 
JOIN Tratamiento t ON T.IdTratamiento = VT.IdTratamiento
WHERE VT.EfectividadVictima > 5 AND VT.IdTratamiento = 2
ORDER BY vv.NombreVictima ASC;

-- Consulta 3
SELECT DISTINCT VV.NombreVictima , VV.ApellidoVictima, vv.DireccionVictima, COUNT(VA.IdVictima) AS Asociados FROM VictimaVirus vv 
JOIN VictimaAsociado va ON VV.IdVictima = VA.IdVictima  
WHERE vv.FechaMuerte IS NOT NULL 
GROUP BY VA.IdVictima, VV.NombreVictima, VV.ApellidoVictima, vv.DireccionVictima
HAVING COUNT (VA.IdVictima) > 3
ORDER BY Asociados DESC;

-- Consulta 4 -- Esta no funciona porque el Estado Suspendida no existe en el archivo excel
SELECT DISTINCT vv.NombreVictima, vv.ApellidoVictima FROM VictimaVirus vv
JOIN VictimaAsociado va ON va.IdVictima = vv.IdVictima
JOIN Contacto c ON c.IdContacto = va.IdContacto
WHERE c.Tipo = 'Beso' AND vv.EstadoVictima = 'Suspendida'
GROUP BY vv.NombreVictima, vv.ApellidoVictima
HAVING COUNT(DISTINCT va.IdAsociado) > 2
ORDER BY vv.NombreVictima ASC;

-- Consulta 5
SELECT DISTINCT vv.NombreVictima, vv.ApellidoVictima, COUNT(vt.IdVictima) AS Tratamientos FROM VictimaVirus vv
JOIN VictimaTratamiento vt ON vt.IdVictima = vv.IdVictima
JOIN Tratamiento t ON t.IdTratamiento = vt.IdTratamiento
WHERE t.Tratamiento = 'Oxigeno'
GROUP BY vt.IdVictima, vv.NombreVictima, vv.ApellidoVictima
ORDER BY Tratamientos DESC, vv.NombreVictima ASC
FETCH FIRST 5 ROWS ONLY;

-- Consulta 6
SELECT vv.NombreVictima, vv.ApellidoVictima, vv.FechaMuerte FROM VictimaVirus vv 
JOIN VictimaTratamiento vt ON vt.IdVictima = vv.IdVictima 
JOIN VictimaUbicacion vu ON vu.IdVictima = vv.IdVictima 
JOIN Ubicacion u ON u.IdUbicacion = vu.IdUbicacion 
JOIN Tratamiento t ON t.IdTratamiento = vt.IdTratamiento 
WHERE u.Direccion = '1987 Delphine Well' AND t.Tratamiento = 'Manejo de la presion arterial' AND vv.FechaMuerte IS NOT NULL
ORDER BY vv.NombreVictima, vv.ApellidoVictima ASC;

-- Consulta 7 -- COUNT(DISTINCT VA.IdAsociado) AS Asociados -- JOIN VictimaAsociado va ON VA.IdVictima = VV.IdVictima -- JOIN VictimaHospital vh ON VH.IdVictima = VV.IdVictima  -- COUNT(DISTINCT VA.IdAsociado) <= 2 AND
SELECT DISTINCT VV.NombreVictima, VV.ApellidoVictima, VV.DireccionVictima, COUNT(DISTINCT VT.IdTratamiento) AS Tratamientos
FROM VictimaVirus vv
JOIN VictimaTratamiento vt ON VV.IdVictima = VT.IdVictima 
GROUP BY VV.IdVictima, VV.NombreVictima, VV.ApellidoVictima, VV.DireccionVictima
HAVING COUNT(DISTINCT VT.IdTratamiento) = 2
ORDER BY vv.NombreVictima, vv.ApellidoVictima ASC;

-- Consulta 8
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

)ORDER BY NUM_TRAT DESC;

-- Consulta 9
SELECT h.NombreHospital, (Count(vv.IdVictima)/(SELECT COUNT(*) FROM VictimaHospital))*100 AS Porcentaje 
FROM VictimaVirus vv 
JOIN VictimaHospital vh ON vv.IdVictima = vh.IdVictima 
JOIN Hospital h ON vh.IdHospital = h.IdHospital 
GROUP BY h.NombreHospital
ORDER BY Porcentaje DESC;

-- Consulta 10
SELECT h.NombreHospital, c.Tipo AS NombreContacto, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM VictimaHospital vh2 WHERE vh2.IdHospital = h.IdHospital) AS PorcentajeVictimas
FROM VictimaHospital vh
JOIN Hospital h ON vh.IdHospital = h.IdHospital
JOIN VictimaAsociado va ON vh.IdVictima = va.IdVictima
JOIN Contacto c ON va.IdContacto = c.IdContacto
GROUP BY h.IdHospital, c.Tipo, h.NombreHospital
ORDER BY h.NombreHospital, PorcentajeVictimas DESC;