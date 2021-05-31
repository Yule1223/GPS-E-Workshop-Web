"use strict";

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelClientes = require("../models/modelClientes");
const modelC = new modelClientes(pool);

class controllerEmpleados {
    identificacionRequerida(request, response, next) {
        if (request.session.currentUser !== undefined && request.session.currentType !== undefined && request.session.currentId !== undefined && request.session.currentType === "administrativo") {
            response.locals.userEmail = request.session.currentUser;
            response.locals.userType = request.session.currentType;
            response.locals.userId = request.session.currentId;
            next();
        } else {
            response.redirect("/login");
        }
    }

    insertarCliente(request, response) {
        let nombre = request.body.nombre;
        let apellido = request.body.apellido;
        let telefono = request.body.telf;
        let dni = request.body.dni;

        let hasNumNombre = /\d/.test(nombre);
        if (hasNumNombre) {
            response.render("registrar_cliente", {errorMsg: "Error relacionado con el nombre"});
        } else {
            let hasNumApellido = /\d/.test(apellido);
            if (hasNumApellido) {
                response.render("registrar_cliente", {errorMsg: "Error relacionado con el apellido"});
            } else {
                if (isNaN(telefono) || telefono.length !== 9 || telefono.includes('e')) {
                    response.render("registrar_cliente", {errorMsg: "Error relacionado con el teléfono"});
                } else {
                    var numero;
                    var letr;
                    var letra;
                    var expresion_regular_dni;

                    expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

                    if (expresion_regular_dni.test(dni) == true) {
                        numero = dni.substr(0, dni.length - 1);
                        letr = dni.substr(dni.length - 1, 1);
                        numero = numero % 23;
                        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
                        letra = letra.substring(numero, numero + 1);
                        if (letra != letr.toUpperCase()) {
                            response.render("registrar_cliente", {errorMsg: "DNI erróneo, la letra del DNI no se corresponde"});
                        } else {
                            modelC.isClienteExist(dni, cb_isClienteExist);

                            function cb_isClienteExist(err, result) {
                                if (err) {
                                    next(err);
                                } else {
                                    if (!result) { //si no existia ese dni en la BD
                                        modelC.insertCliente(telefono, nombre, apellido, dni, cb_insertCliente);

                                        function cb_insertCliente(err1, result1) {
                                            if (err1) {
                                                next(err);
                                            } else {
                                                if (!result1) {
                                                    response.status(200);
                                                    response.render("registrar_cliente", {errorMsg: "Error, inserta de nuevo"});
                                                } else {
                                                    response.status(200);
                                                    response.render("principal", {msg: "Cliente insertado correctamente"});
                                                }
                                            }
                                        }
                                    } else {
                                        response.render("registrar_cliente", {errorMsg: "DNI ya existe"});
                                    }
                                }
                            }
                        }
                    } else {
                        response.render("registrar_cliente", {errorMsg: "DNI erroneo, formato no válido"});
                    }
                }
            }
        }
    }

    carga_formulario(request, response) {
        response.status(200);
        response.render("registrar_cliente", {errorMsg: null});
    }

    pagina_cliente(request, response, next) {
        let numMax = 20;//número de páginas definido en el PB

        modelC.getClientes(request.params.id, numMax, cb_getClientes);

        function cb_getClientes(err, rows, rows2) {
            if (err) {
                next(err);
            } else {
                response.status(200);
                var clientes = rows;
                clientes.numeroTotal = rows2[0].NumeroTotal;
                clientes.nPages = Math.ceil(clientes.numeroTotal / numMax);
                clientes.activePage = request.params.id;
                clientes.numeroClientes = numMax;
                response.render("pagina_cliente", {msg: "Cliente insertado correctamente", clientes: clientes});
            }
        }
    }

    detalle_cliente(request, response) {
        modelC.getCliente(request.params.id, cb_getCliente);

        function cb_getCliente(err, result, rows) {
            if (err) {
                next(err);
            } else {
                if (result) { //cliente encontrado
                    response.status(200);
                    let cliente = rows;
                    response.render("ver_cliente", {cliente: cliente, errorMsg: null});
                } else {
                    response.render("error404", {url: request.url});
                }
            }
        }
    }


    modificarCliente(request, response) {
        let nombre_nuevo = request.body.nombre;
        let apellido_nuevo = request.body.apellido;
        let telefono_nuevo = request.body.telf;
        let dni_nuevo = request.body.dni;
        let id = request.params.id;

        modelC.getCliente(id, cb_getCliente);

        function cb_getCliente(err, result, rows) {
            if (err) {
                next(err);
            } else {
                if (result) { //cliente encontrado
                    //response.status(200);
                    //Cogemos el cliente
                    let cliente = rows;
                    //comprobamos si el nombre tiene número
                    let hasNumNombre = /\d/.test(nombre_nuevo);
                    if (hasNumNombre) {
                        response.render("modificar_cliente", {
                            errorMsg: "Error relacionado con el nombre",
                            cliente: cliente
                        });
                    } else {
                        //comprobamos si el apellido tiene número
                        let hasNumApellido = /\d/.test(apellido_nuevo);
                        if (hasNumApellido) {
                            response.render("modificar_cliente", {
                                errorMsg: "Error relacionado con el apellido",
                                cliente: cliente
                            });
                        } else {
                            //comprobamos si el teléfono son de 9 números
                            if (isNaN(telefono_nuevo) || telefono_nuevo.length !== 9 || telefono_nuevo.includes('e')) {
                                response.render("modificar_cliente", {
                                    errorMsg: "Error relacionado con el teléfono",
                                    cliente: cliente
                                });
                            } else {
                                //comprobamos si el DNI es válido
                                var numero;
                                var letr;
                                var letra;
                                var expresion_regular_dni;

                                expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

                                if (expresion_regular_dni.test(dni_nuevo) == true) {
                                    numero = dni_nuevo.substr(0, dni_nuevo.length - 1);
                                    letr = dni_nuevo.substr(dni_nuevo.length - 1, 1);
                                    numero = numero % 23;
                                    letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
                                    letra = letra.substring(numero, numero + 1);
                                    if (letra != letr.toUpperCase()) {
                                        response.render("modificar_cliente", {
                                            errorMsg: "DNI erróneo, la letra del DNI no se corresponde",
                                            cliente: cliente
                                        });
                                    } else {
                                        //comprobamos si el DNI ya existe en la BBDD
                                        modelC.isClienteExist(dni_nuevo, cb_isClienteExist);

                                        function cb_isClienteExist(err, result) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                if (!result) { //si no existia ese dni en la BD
                                                    modelC.updateCliente(id, telefono_nuevo, nombre_nuevo, apellido_nuevo, dni_nuevo, cb_updateCliente);

                                                    function cb_updateCliente(err1, result1) {
                                                        if (err1) {
                                                            next(err);
                                                        } else {
                                                            if (!result1) {
                                                                response.status(200);
                                                                response.render("modificar_cliente", {
                                                                    errorMsg: "Error, intenta de nuevo",
                                                                    cliente: cliente
                                                                });
                                                            } else {
                                                                response.status(200);
                                                                response.render("principal", {msg: "Cliente modificado correctamente"});
                                                            }
                                                        }
                                                    }
                                                } else {//si ya existia ese dni en la BBDD
                                                    //comprobamos si el DNI nuevo es igual que el anterior
                                                    if (cliente.dni === dni_nuevo) {
                                                        modelC.updateCliente(id, telefono_nuevo, nombre_nuevo, apellido_nuevo, dni_nuevo, cb_updateCliente);

                                                        function cb_updateCliente(err1, result1) {
                                                            if (err1) {
                                                                next(err);
                                                            } else {
                                                                if (!result1) {
                                                                    response.status(200);
                                                                    response.render("modificar_cliente", {
                                                                        errorMsg: "Error, intenta de nuevo",
                                                                        cliente: cliente
                                                                    });
                                                                } else {
                                                                    response.status(200);
                                                                    response.render("principal", {msg: "Cliente modificado correctamente"});
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        response.render("modificar_cliente", {
                                                            errorMsg: "DNI ya existe",
                                                            cliente: cliente
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    response.render("modificar_cliente", {
                                        errorMsg: "DNI erroneo, formato no válido",
                                        cliente: cliente
                                    });
                                }
                            }
                        }
                    }
                } else {
                    response.render("error404", {url: request.url});
                }
            }
        }

    }


    bajaCliente(request, response) {
        modelC.hasVehicle(request.params.id, cb_hasVehicle);
        function cb_hasVehicle(err1, result1) {
            if (err1) {
                next(err1);
            } else {
                if (result1) {
                    response.status(200);
                    modelC.getCliente(request.params.id, function (err2, result2, rows2) {
                        if (err2) {
                            next(err2);
                        } else {
                            if (result2) {
                                let cliente = rows2;
                                response.render("ver_cliente", {
                                    errorMsg: "Error, este cliente tiene vehículos asociados",
                                    cliente: cliente
                                });
                            }
                        }
                    })
                } else {
                    modelC.removeCliente(request.params.id, cb_removeCliente);
                    function cb_removeCliente(err3, result3) {
                        if (err3) {
                            next(err3);
                        } else {
                            if (!result3) {
                                response.status(200);
                                modelC.getCliente(request.params.id, function (err4, result4, rows4) {
                                    if (err4) {
                                        next(err4);
                                    } else {
                                        if (result4) {
                                            let cliente = rows4;
                                            response.render("ver_cliente", {
                                                errorMsg: "Error, intenta de nuevo",
                                                cliente: cliente
                                            });
                                        }
                                    }
                                })
                            } else {
                                response.status(200);
                                response.render("principal", {msg: "Baja de cliente realizada con éxito"});
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = controllerEmpleados;
