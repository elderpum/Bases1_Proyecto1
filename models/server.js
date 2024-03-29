const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT ?? 3200;

        this.paths = {
            api: '/api/',
        }

        // Rutas de mi aplicación
        this.routes();

    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.paths.api, require('../routes/api'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server on port', this.port)
        });
    }

}

module.exports = Server;