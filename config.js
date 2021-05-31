"use strict";
module.exports = {

    mysqlConfig: {
        host: "f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",// Ordenador que ejecuta el SGBD
        user: "mbej5u6wru5m3i87",// Usuario que accede a la BD
        password: "dgbd3noxw1xezqlx",// Contraseña con la que se accede a la BD
        database: "jknvqzplz4jj6tes"// Nombre de la base de datos
    },
    port: process.env.PORT || 3306// Puerto en el que escucha el servidor*/
    /*
    mysqlConfig: {
        host: "localhost",     // Ordenador que ejecuta el SGBD
        user: "root",          // Usuario que accede a la BD
        password: "",          // Contraseña con la que se accede a la BD
        database: "E-Workshop"     // Nombre de la base de datos
    },
    port: 8000                   // Puerto en el que escucha el servidor
    */
}