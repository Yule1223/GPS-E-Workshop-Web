"use strict";

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelVehiculos = require("../models/modelVehiculos");
const modelV = new modelVehiculos(pool);

class controllerVehiculos {
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

    insertarVehiculo(request, response, next) {
        let {
            matricula,
            bastidor,
            velocidadCarga,
            kms,
            capacidadCarga,
            potencia,
            idCliente,
        } = request.body;

        let matriculaFix = matricula.match(/^\d{4}[B-DF-HJ-NPR-TV-Z]{3}$/g);
        let bastidorFix = bastidor.match(/^[0-9A-HJ-NPR-Z]{17}$/g);
        if (capacidadCarga < 0)
            response.render("registrar_vehiculo", { msg: "La capacidad de carga no debería ser negativa" });
        else if (kms.length > 7)
            response.render("registrar_vehiculo", { msg: "La cantidad de kms no debe tener más de 7 digitos" })
        else if (potencia < 0)
            response.render("registrar_vehiculo", { msg: "La potencia no debería ser negativa" });
        else if (kms < 0)
            response.render("registrar_vehiculo", { msg: "Los KMs no deberían ser negativos" });
        else if (velocidadCarga < 0)
            response.render("registrar_vehiculo", { msg: "La velocidad de carga no debería ser negativa" });
        else if (matricula.length !== 7)
            response.render("registrar_vehiculo", { msg: "La matricula debe tener 7 carácteres" });
        else if (matriculaFix === null)
            response.render("registrar_vehiculo", { msg: "La matricula no es válida" });
        else if (bastidorFix === null)
            response.render("registrar_vehiculo", { msg: "El bastidor no tiene un formato válido" });
        else if (bastidor.length !== 17)
            response.render("registrar_vehiculo", { msg: "El bastidor debe contener 17 digitos" });
        else {
            modelV.insertvehicle(matricula, bastidor, velocidadCarga, kms, capacidadCarga, potencia, idCliente,
                (err, res) => {
                    if (err) {
                        console.log(err);
                        response.render("registrar_vehiculo", { msg: err.message });
                    } else {
                        response.status(200);
                        response.render("principal", { msg: res });
                    }
                }
            );
        }

    }

    paginaVehiculo(request, response) {
        let numMax = 20;//número de páginas definido en el PB

        modelV.getVehiculos(request.params.id, numMax, cb_getVehiculos);

        function cb_getVehiculos(err, rows, rows2) {
            if (err) {
                next(err);
            } else {
                response.status(200);
                var vehiculos = rows;
                vehiculos.numeroTotal = rows2[0].NumeroTotal;
                vehiculos.nPages = Math.ceil(vehiculos.numeroTotal / numMax);
                vehiculos.activePage = request.params.id;
                vehiculos.numeroClientes = numMax;
                response.render("pagina_vehiculo", {msg: "Vehiculo insertado correctamente", vehiculos: vehiculos});
            }
        }
    }

    registrarVehiculos(request, response) {
        response.status(200);
        response.render("registrar_vehiculo", { msg: null });
    }

    detalle_vehiculo(request, response){
        modelV.getVehiculo(request.params.id,cb_getVehiculo);

        function cb_getVehiculo(err,result,rows){
            if (err) {
                next(err);
            } else {
                if (result) { //vehiculo encontrado
                    response.status(200);
                    let vehiculo = rows;
                    response.render("ver_vehiculo", {vehiculo: vehiculo});
                } else {
                    response.render("error404", {url: request.url});
                }
            }

        }
    }
}

module.exports = controllerVehiculos;
