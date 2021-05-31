"use strict";

const express = require("express");
const path = require("path");
const routerClientes = express.Router();
const controllerClientes = require("../controllers/controllerClientes");
const controllerC = new controllerClientes();

// ACCIONES PARA REDIRIGIR A LAS VISTAS

routerClientes.get("/registrarClientes",controllerC.identificacionRequerida, controllerC.carga_formulario);

routerClientes.post("/nuevoCliente",controllerC.identificacionRequerida, controllerC.insertarCliente);

routerClientes.post("/modificarCliente/:id",controllerC.identificacionRequerida, controllerC.modificarCliente);

routerClientes.get("/bajaCliente/:id",controllerC.identificacionRequerida, controllerC.bajaCliente);

routerClientes.get("/detalleCliente/:id",controllerC.identificacionRequerida, controllerC.detalle_cliente);

routerClientes.get("/:id",controllerC.identificacionRequerida, controllerC.pagina_cliente);

module.exports = routerClientes;