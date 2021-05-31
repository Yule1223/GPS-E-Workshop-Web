"use strict";

const express = require("express");
const path = require("path");
const routerEmpleados = express.Router();
const controllerEmpleados = require("../controllers/controllerEmpleados");
const controllerE = new controllerEmpleados();

routerEmpleados.post("/login", controllerE.login);

routerEmpleados.get("/", controllerE.identificacionRequerida, controllerE.pagina_empleado);

routerEmpleados.get("/registrarEmpleados", controllerE.identificacionRequerida, controllerE.registrarEmpleados)

routerEmpleados.post("/nuevoEmpleado", controllerE.identificacionRequerida, controllerE.nuevoEmpleado)

module.exports = routerEmpleados;