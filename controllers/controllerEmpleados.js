"use strict";

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelEmpleados = require("../models/modelEmpleados");
const modelE = new modelEmpleados(pool);

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

    login(request, response) {
        modelE.isUserCorrect(request.body.email, request.body.password, cb_isUserCorrect);

        //result1 para comprobar email y password OK
        //result2 para comprobar empleado activo
        function cb_isUserCorrect(err, result1, result2, rows) {
            if (err) {
                next(err);
            } else {
                if (!result1) {
                    response.status(200);
                    response.render("login", {errorMsg: "Email y/o contraseña no válidos"});
                } else if (!result2) {
                    response.status(200);
                    response.render("login", {errorMsg: "Empleado no activo"});
                } else {
                    response.status(200);
                    request.session.currentUser = request.body.email;
                    response.locals.userEmail = request.body.email;
                    request.session.currentType = rows.tipo;
                    response.locals.userType = request.session.currentType;
                    request.session.currentId = rows.id;
                    response.locals.userId = request.session.currentId;

                    console.log(response.locals.userType);
                    response.render("principal", {msg: null, name: rows.name, userType: request.session.currentType});
                }
            }
        }
    }

    registrarEmpleados(request, response) {
        response.status(200);
        response.render("registrar_empleado", {errorMsg: null});
    }

    pagina_empleado(request, response) {
        response.status(200);
        response.render("pagina_empleado");
    }

    nuevoEmpleado(request, response) {
        let dni = request.body.dni;
        let apellido = request.body.apellido;
        let nombre = request.body.nombre;
        let tipo = request.body.tipo;
        let telf = request.body.telf;
        let email = request.body.email;
        let passw1 = request.body.passw1;
        let passw2 = request.body.passw2;

        var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if (emailRegex.test(email)) {
            let hasNumNombre = /\d/.test(nombre);
            if (hasNumNombre) {
                response.render("registrar_empleado", {errorMsg: "Error relacionado con el nombre"});
            }
            else{
                let hasNumApellido = /\d/.test(apellido);
                if (hasNumApellido) {
                    response.render("registrar_empleado", {errorMsg: "Error relacionado con el apellido"});
                }
                else{
                    if (isNaN(telf) || telf.length !== 9 || telefono.includes('e')) {
                        response.render("registrar_empleado", {errorMsg: "Error relacionado con el teléfono"});
                    }
                    else{
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
                                response.render("registrar_empleado", {errorMsg: "DNI erroneo, la letra del DNI no se corresponde"});
                            }
                            else{
                                if (passw1 !== passw2) {
                                    response.render("registrar_empleado", {errorMsg: "La contraseña de verificación no coincide"});
                                } else {
                                    if (passw1.length < 6) {
                                        response.render("registrar_empleado", {errorMsg: "La contraseña no tiene la longitud necesaria"});
                                    }
                                    else {
                                        modelE.isEmpleadoExist(dni, cb_isEmpleadoExist);

                                        function cb_isEmpleadoExist(err, result) {
                                            if (err) {
                                                response.status(500);
                                                response.render("registrar_empleado", {errorMsg: err.message});
                                            } else {
                                                if (!result) { //si no existia ese dni en la BD
                                                    modelE.insertEmpleado(nombre, apellido, email, passw1, dni, telf, tipo, cb_insertEmpleado);

                                                    function cb_insertEmpleado(err1, result1) {
                                                        if (err1) {
                                                            response.status(500);
                                                            response.render("registrar_empleado", {errorMsg: err1.message});
                                                        } else {
                                                            if (!result1) {
                                                                response.status(200);
                                                                response.render("registrar_empleado", {errorMsg: "Error, inserta de nuevo"});
                                                            } else {
                                                                response.status(200);
                                                                response.render("principal", {msg: "Empleado insertado correctamente"});
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    response.render("registrar_empleado", {errorMsg: "DNI ya existe"});
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            response.render("registrar_empleado", {errorMsg: "DNI erroneo, formato no válido"});
                        }
                    }
                }
            }
        } else {
            response.render("registrar_empleado", {errorMsg: "Error relacionado con el email"});
        }
    }
}

module.exports = controllerEmpleados;
