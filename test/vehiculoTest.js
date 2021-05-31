var chai = require('chai');
var expect = chai.expect;
var axios = require('axios');
//const assert = chai.assert;
//var should = chai.should();

//ejecutar npm test

describe('Test login1', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test login2', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/login')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test pagina principal', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/principal')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test logout', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/logout')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test pagina_vehiculos', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/vehiculos/0')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test registrar_vehiculos', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/vehiculos/registrarVehiculo')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test ver_vehiculo', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/vehiculos/detalleVehiculo/1')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

