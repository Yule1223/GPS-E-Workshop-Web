"use strict";

class modelClientes {

    constructor(pool) {
        this.pool = pool;
    }

    isClienteExist(dni, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM cliente WHERE dni = ?";
                connection.query(sql, [dni], function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (rows.length === 0) {
                            callback(null, false);
                        } else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }

    updateCliente(id, telefono, nombre, apellido, dni, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql1 = "UPDATE cliente SET telefono = ?, nombre = ?, apellido = ?, dni = ? WHERE id = ? ";
                connection.query(sql1, [telefono, nombre, apellido, dni, id], function (err, rows1) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (rows1.length === 0) {
                            callback(null, false); //no se ha encontrado ningun cliente con ese DNI
                        } else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }


    insertCliente(telefono, nombre, apellido, dni, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                console.log("datos que llegam al modelo");
                console.log(telefono, nombre, apellido, dni);

                const sql = "INSERT INTO cliente (telefono, nombre, apellido, dni) VALUES (?, ?, ?, ?)";
                connection.query(sql, [telefono, nombre, apellido, dni], function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (rows.length === 0) {
                            callback(null, false); //no se ha podido insertar
                        } else {
                            callback(null, true);//se ha insertado correctamente
                        }
                    }
                });
            }
        });
    }

    getClientes(page, numMax, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let comienzo = numMax * page;
                const sql1 = `SELECT id, dni, nombre, apellido FROM cliente WHERE activo = 1 ORDER BY id LIMIT ${comienzo},${numMax}`;
                connection.query(sql1, function (err, rows) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        const sql3 = "SELECT COUNT(*) as NumeroTotal FROM cliente";
                        connection.query(sql3, function (err3, rows2) {
                            connection.release(); // devolver al pool la conexión
                            if (err3)
                                callback(new Error("Error de acceso a la base de datos"));
                            else {
                                callback(null, rows, rows2);
                            }
                        });
                    }
                });
            }
        });
    }

    getCliente(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT id, dni, nombre, apellido, telefono FROM cliente WHERE id = ?";
                connection.query(sql, [id], function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (rows.length === 0) {
                            callback(null, false);
                        } else {
                            callback(null, true, rows[0]);
                        }
                    }
                });
            }
        });
    }

    hasVehicle(id_cliente, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM vehiculo WHERE id_cliente = ? AND activo = 1";
                connection.query(sql, [id_cliente], function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (rows.length === 0) {
                            callback(null, false);
                        } else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }

    removeCliente(id, callback, rows) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "UPDATE cliente SET activo = 0 WHERE id = ?";
                connection.query(sql, [id], function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos :)"));
                    } else {
                        if (rows.length === 0) {
                            callback(null, false);
                        } else {
                            callback(null, true, rows[0]);
                        }
                    }
                });
            }
        });
    }
}

module.exports = modelClientes;
