OPTIONS (SKIP=1)
	LOAD DATA
	CHARACTERSET UTF8
	INFILE './database/DB_Excel.csv'
	INTO TABLE Temporal TRUNCATE
	FIELDS TERMINATED BY ';'
	TRAILING NULLCOLS(
		NombreVictima,
		ApellidoVictima,
		DireccionVictima,
		FechaPrimeraSospecha DATE 'DD-MM-YYYY HH24:MI',
		FechaConfirmacion DATE 'DD-MM-YYYY HH24:MI',
		FechaMuerte DATE 'DD-MM-YYYY HH24:MI',
		EstadoVictima,
		NombreAsociado,
		ApellidoAsociado,
		FechaConocido DATE 'DD-MM-YYYY HH24:MI',
		ContactoFisico,
		FechaInicioContacto DATE 'DD-MM-YYYY HH24:MI',
		FechaFinContacto DATE 'DD-MM-YYYY HH24:MI',
		NombreHospital,
		DireccionHospital,
		UbicacionVictima,
		FechaLlegada DATE 'DD-MM-YYYY HH24:MI',
		FechaRetiro DATE 'DD-MM-YYYY HH24:MI',
		Tratamiento,
		Efectividad INTEGER EXTERNAL,
		FechaInicioTratamiento DATE 'DD-MM-YYYY HH24:MI',
		FechaFinTratamiento DATE 'DD-MM-YYYY HH24:MI',
		EfectividadEnVictima INTEGER EXTERNAL
	)