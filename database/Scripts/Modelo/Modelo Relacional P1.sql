CREATE TABLE VictimaVirus (
    IdVictima NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreVictima VARCHAR2(100) NULL,
    ApellidoVictima VARCHAR2(100) NULL,
    DireccionVictima VARCHAR2(200) NULL,
    FechaPrimeraSospecha DATE NULL,
    FechaConfirmacion DATE NULL,
    FechaMuerte DATE NULL,
    EstadoVictima VARCHAR2(100) NULL
);

CREATE TABLE Hospital(
    IdHospital NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreHospital VARCHAR2(200) NULL,
    DireccionHospital VARCHAR2(200) NULL
);

CREATE TABLE Tratamiento(
    IdTratamiento NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Tratamiento VARCHAR2(200) NULL,
    Efectividad INTEGER NULL
);

CREATE TABLE Ubicacion(
    IdUbicacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Direccion VARCHAR2(200) NULL
);

CREATE TABLE Contacto(
    IdContacto NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Tipo VARCHAR2(200) NULL
);

CREATE TABLE Asociado(
    IdAsociado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreAsociado VARCHAR2(200) NULL,
    ApellidoAsociado VARCHAR2(200) NULL
);

CREATE TABLE VictimaTratamiento(
    IdVictimaTratamiento NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EfectividadVictima INTEGER NULL,
    FechaInicioTratamiento DATE NULL,
    FechaFinTratamiento DATE NULL,
    IdVictima NUMBER(10),
    IdTratamiento NUMBER(10),
    
    
);