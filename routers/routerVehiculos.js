"use strict";

const express = require("express");
const path = require("path");
const routerVehiculos = express.Router();
const controllerVehiculos = require("../controllers/controllerVehiculos");
const controllerV = new controllerVehiculos();

//formulario de vehiculo
routerVehiculos.get("/registrarVehiculo", controllerV.identificacionRequerida, controllerV.registrarVehiculos);

//añadir vehiculo a la base de datos
routerVehiculos.post("/insertarVehiculo", controllerV.identificacionRequerida, controllerV.insertarVehiculo);

//pantalla para ver datos básicos de vehiculo
routerVehiculos.get("/detalleVehiculo/:id",controllerV.identificacionRequerida,controllerV.detalle_vehiculo);

//pantalla principal de vehiculo
routerVehiculos.get("/:id", controllerV.identificacionRequerida, controllerV.paginaVehiculo);

module.exports = routerVehiculos;
