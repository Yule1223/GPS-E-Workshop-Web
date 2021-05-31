"use strict";

class modelEmpleados {

    constructor(pool) {
        this.pool=pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM empleado WHERE email = ? AND password = ?";
                connection.query(sql, [email,password], function(err, rows) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            const sql = "SELECT * FROM empleado WHERE email = ? AND password = ? AND activo = 1";
                            connection.query(sql, [email,password], function(err, rows) {
                                connection.release(); // devolver al pool la conexión
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    if (rows.length === 0) {
                                        callback(null, true, false); //no está el usuario con el password proporcionado
                                    }
                                    else {
                                        callback(null, true, true, rows[0]);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    isEmpleadoExist(dni, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM empleado WHERE dni = ?";
                connection.query(sql, [dni], function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }

    insertEmpleado(nombre, apellido, email, password, dni, telefono, tipo, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                const sql = "INSERT INTO empleado (nombre, apellido, email, password, dni, telefono, tipo) VALUES(?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [nombre, apellido, email, password, dni, telefono, tipo], function(err1, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err1) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }
}
module.exports = modelEmpleados;
