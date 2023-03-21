# Sistemas de Bases de Datos #1
##  Proyecto 1 

![Javascript](https://img.shields.io/badge/-Javascript-0d0d0d?style=flat&logo=javascript&logoColor=FED800)![Node.js](https://img.shields.io/badge/-Node.js-0d0d0d?style=flat&logo=node.js&logoColor=0CFE00)![Oracle](https://img.shields.io/badge/-Oracle-0d0d0d?style=flat&logo=oracle&logoColor=FF0000)![Docker](https://img.shields.io/badge/-Docker-0d0d0d?style=flat&logo=docker&logoColor=0db7ed)
```js
Universidad San Carlos de Guatemala 2022
Programador: Elder Anibal Pum Rojas
Carne: 201700761
Correo: ElderPum@gmail.com
```
---

### ¿En qué consiste el proyecto?
Básicamente es una API que nos permite manejar una base de datos de Oracle, alojada en un contenedor de Docker. Esto con el objetivo de aislar el proceso y ahorrar espacio en las máquinas donde se instale el proyecto. Además, se puede manejar la base de Oracle remotamente para que así, podamos eliminar y crear tablas dentro de la base de datos, así como también la carga masiva de información usando archivos (en este caso un archivo .csv) utilizando herramientas externas de Oracle, como por ejemplo SQL Loader.

---

### Modelos Utilizados para el Planteamiento de la DB en Oracle
Para empezar a modelar nuestra base de datos, empezaremos por crear un modelo conceptual para ver como irá la estructura de nuestra db:
![ModeloConceptual](https://i.ibb.co/YtMxZ43/Modelo-Conceptual.png)

Una vez tengamos nuestro modelo conceptual, lo siguiente es romper relaciones muchos a muchos que puedan surgir durante el modelado, por ende, vamos a pasar al modelo lógico, que es un modelo más completo que el conceptual pero no tiene dentro de sí todas las relaciones que puede tener un modelo relacional:
![ModeloLogico](https://i.ibb.co/mcrqnbJ/Modelo-Logico.png)

Como mencionamos anteriormente, el siguiente paso es crear nuestro modelo relacional. Este modelo ya es una versión completa de la base de datos, donde cada columna de cada tabla tiene su valor, así como si es llave primaria o foránea y las múltiples relaciones que pueda llegar a tener con otras tablas:
![ModeloRelacional](https://i.ibb.co/fqzStnC/Modelo-Relacional.png)

---
### Montar Oracle en Docker
Para este proyecto se decidió ir por la alternativa de Docker para ahorrar espacio y molestias a futuro con la instalación física de Oracle, por lo que usamos un archivo especial, este se llama:
```
docker-compose.yml
```

La estructura de dicho archivo es la siguiente:
```
version: '3'
services:

  # Oracle service (label used to access the service container)
  oracle:

    # Docker Hub image (feel free to change the tag "latest" to any other available one)
    image: gvenzl/oracle-xe:21.3.0

    # Provide passwords and other environment variables to container

    environment:
      - APP_USER=epum 
      - APP_USER_PASSWORD=root 
      - ORACLE_PASSWORD=root
    # Forward Oracle port
    ports:
      - 1521:1521
    volumes:
      - ./:/opt/oracle/oradata

volumes:
  oracle-data:
```

Para ejecutar este archivo, tan solo basta ubicarnos al mismo nivel del archivo, abrir una terminal cmd o PowerShell y escribir lo siguiente:

```
docker compose up
```

Docker hará el resto haciendo pull a la imagen y descargando los archivos necesarios, una vez finalizado el proceso podremos ver que el contenedor está corriendo usando el comando:

```
docker ps
```

---
### Accediendo al Contenedor para Crear el Usuario SQL
Una vez tengamos montado nuestro contenedor con la imagen de Oracle, resta entrar al bash del contenedor, vamos a usar el siguiente comando:
```
docker exec -i -t [nombre del contenedor de docker] /bin/bash
```

Una vez que estemos dentro, vamos a iniciar SQLPlus, para ello vamos a invocar el comando:
```
SQLPlus
```

Cuando lo hagamos nos va a pedir el usuario y la contraseña, vamos a ingresar lo siguiente:
```
user-name: sys as sysdba #USUARIO POR DEFECTO
password: oracle #PASSWORD POR DEFECTO

alter session set "_ORACLE_SCRIPT"=true;
create user (Tu nuevo usuario) identified by (Tu nueva contraseña);
grant all privileges to (Tu nuevo usuario); #Le damos privilegios
```

Con eso ya tendríamos nuestro nuevo usuario y nuestra nueva contraseña, así cuando volvamos a escribir sqlplus, nos podemos loguear con este usuario y además, es el que vamos a usar para loguearnos ya sea en DBeaver o SQL Developer.

---
### Usando SQL Loader para la Carga Masiva de Datos
Vamos a tener que usar carga masiva para la inserción de datos en la tabla Temporal de nuestro modelo, para ello vamos a descargar SQL Loader junto a su componentes en la [siguiente página.](https://www.oracle.com/es/database/technologies/instant-client/winx64-64-downloads.html)

Una vez hayamos descargado el Basic Package junto a los tools SQL*Plus Package y Tools Package, los descomprimimos en una carpeta llamada "Oracle" en el disco local C y esa ruta la añadimos a las variables de entorno, específicamente PATH tanto global como de usuario. Una vez hecho esto basta con reiniciar las terminales abiertas e ingresar el siguiente comando para constatar de que están funcionando nuestras herramientas:
```
sqlldr
```

Si nos muestra el menú de --help o nos muestra un error es porque está funcionando a la perfección nuestro comando, ahora vamos a ver un ejemplo de como podemos conectar sqlldr de manera local a la base de datos en docker para que la carga masiva funcione donde sea:
```
sqlldr userid=[Usuario que se creó en la db usando sqlplus]/[Contraseña de dicho usuario]@localhost:1521/XE control=./database/CargaDatos.ctl
```

Como pueden darse cuenta usamos el username y la contraseña proporcionados anteriormente y así nos conectamos a la db que está en docker, después le pasamos un archivo de extensión .ctl para la carga de datos. Dicho archivo tiene la siguiente estructura:
```
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
```
Este tiene la misma estructura que nuestra tabla Temporal, porque ahí van a parar los datos del archivo CSV.