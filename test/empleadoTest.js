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

describe('Test pagina_empleados', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/empleados/')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe('Test registrar_empleados', function () {
    it('returns status 200', function (done) {
        axios.get('https://e-workshop-gps.herokuapp.com/empleados/registrarEmpleados')
            .then(function (res) {
                expect(res.status).to.equal(200)
                done();
            })
    })
})