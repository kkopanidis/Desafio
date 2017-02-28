"use strict";
//process.env.NODE_ENV = 'test';
var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

var userid = 0; //logged in user
var Cookies;

describe('Register', function () {
    it('should register a new user', function (done) {
        chai.request(server)
            .post('/register')
            .send({
                "username": "utest",
                "password": "test123",
                "email": "utest@test.com",
                "dob": "1995-11-25"
            })
            .expect(200)
            .end(function (err, res) {
                res.body.username.should.equal('utest');
                res.body.email.should.equal('utest@test.com');
                res.body.password.should.equal('test123');
                res.body.dob.should.equal('1995-11-25');
                done();
            });
    });
});

describe('Login and sessions', function () {
    it('should create user session for valid user', function (done) {
        chai.request(server)
            .post('/api/oauth/token')
            .set('Accept', 'application/json')
            .send({
                "grant_type": "password",
                "client_id": "Axxh45u4bdajGDshjk21n",
                "client_secret": "d13e~223~!!@$5dasd",
                "username": "utest@test.com",
                "password": "test123"
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.id.should.equal('1');
                res.body.username.should.equal('utest@test.com');
                res.body.password.should.equal('test123');
                res.body.cliend_id.should.equal("Axxh45u4bdajGDshjk21n");
                res.body.client_secret.should.equal("d13e~223~!!@$5dasd");
                res.body.grant_type.should.equal("password");
                // Save the cookie to use it later to retrieve the session
                Cookies = res.body.access_token;
                userid = res.body.id; // pws pairnw to active user id?
                done();
            });
    });
    it('should get user session for current user', function (done) {
        var req = request(app).get('/api/oauth/token');
        // Set cookie to get saved user session
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.id.should.equal('1');
                res.body.username.should.equal('utest@test.com');
                res.body.password.should.equal('test123');
                res.body.cliend_id.should.equal("Axxh45u4bdajGDshjk21n");
                res.body.client_secret.should.equal("d13e~223~!!@$5dasd");
                res.body.grant_type.should.equal("password");
                done();
            });
    });
});

describe('challenge flow', function () {
    it('should get ALL challenges on /flow GET', function (done) {
        chai.request(server)
            .get('/flow')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                done();
            });
    });
    it('should create a new challenge on / POST', function (done) {
        chai.request(server)
            .post('/')
            .send({'title': 'testaki', 'desc': 'perigrafh lol', 'type': 'food', 'issuer': userid})
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('title');
                res.body.SUCCESS.should.have.property('desc');
                res.body.SUCCESS.should.have.property('type');
                res.body.SUCCESS.should.have.property('issuer');
                res.body.SUCCESS.should.have.property('_id');
                res.body.SUCCESS.title.should.equal('testaki');
                res.body.SUCCESS.desc.should.equal('perigrafh lol');
                res.body.SUCCESS.type.should.equal('food');
                res.body.SUCCESS.issuer.should.equal(userid);
                done();
            });
    });
    // TODO
    it('should create a new gauntlent on /gaunlet POST', function (done) {
        chai.request(server)
            .post('/gaunlet')
            .send({})
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');

                done();
            });
    });
});