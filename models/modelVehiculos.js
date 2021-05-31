"use strict";

class modelVehiculos {
    constructor(pool) {
        this.pool = pool;
    }

    insertvehicle(matricula, bastidor, velocidadCarga, kms, capacidadCarga, potencia, idCliente, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                //lo primero será comprobar que el idCliente existe y está activo
                const sql1 = "SELECT * from cliente WHERE id = ? AND activo = 1";
                connection.query(sql1, [idCliente], (err, rows) => {
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {
                        if (rows.length === 0) {
                            callback(new Error("El cliente seleccionado no existe.")); //el cliente al que se quiere asociar el vehiculo no existe
                        } else {
                            //cliente existe, ahora comprobar el numero de bastidor y la matricula
                            const sql2 = "SELECT * from vehiculo WHERE bastidor = ?";
                            connection.query(sql2, bastidor, (err, rows) => {
                                if (err)
                                    callback(new Error("Error de acceso a la base de datos"));
                                else {
                                    if (rows.length !== 0)
                                        callback(new Error("El vehiculo ya existe")); //ya hay un vehiculo con esa matricula o con ese bastidor
                                    else {
                                        const sql3 = "SELECT * from vehiculo WHERE matricula = ?";
                                        connection.query(sql3, matricula, (err, rows) => {
                                            if (err)
                                                callback(new Error("Error de acceso a la base de datos"));
                                            else {
                                                if (rows.length !== 0)
                                                    callback(new Error("El vehiculo ya existe")); //ya hay un vehiculo con esa matricula
                                                else {
                                                    const sql4 = "INSERT INTO vehiculo (matricula, bastidor, velocidad_carga, kms, capacidad_carga, potencia, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)";
                                                    connection.query(sql4, [matricula, bastidor, velocidadCarga, kms, capacidadCarga, potencia, idCliente,], (err, rows) => {
                                                            if (err)
                                                                callback(new Error(err.message));
                                                            else {
                                                                if (rows !== 0)
                                                                    callback(null, "Vehiculo insertado correctamente");
                                                                else
                                                                    callback(err, null);
                                                            }

                                                        }
                                                    );
                                                }

                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    getVehiculos(page, numMax, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let comienzo = numMax * page;
                const sql1 = `SELECT id, matricula FROM vehiculo WHERE activo = 1 ORDER BY matricula DESC LIMIT ${comienzo},${numMax}`;
                connection.query(sql1, function (err, rows) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        const sql3 = "SELECT COUNT(*) as NumeroTotal FROM vehiculo";
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

    getVehiculo(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT bastidor, matricula, kms, capacidad_carga, potencia, velocidad_carga, id_cliente FROM vehiculo WHERE id = ?";
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
}

module.exports = modelVehiculos;
