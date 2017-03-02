"use strict";
//process.env.NODE_ENV = 'test';
var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var user = require('../models/user');
var challenge = require('../models/challenge');
var before = require("mocha").before;

chai.use(chaiHttp);

var cookies;

//This is a test group named register
describe('Register', function () {

    //This should launch before the tests of this group
    beforeEach(function (done) {
        user.findOne({username: 'utest'})
            .exec()
            .then(function (result) {
                if (result) {
                    result.remove(function (err) {
                        done()
                    });
                } else {
                    //Calls done when it's done
                    done()
                }
            });
    });

    it('should throw an error on register', function (done) {
        chai.request(server)
            .post('/api/users/register')
            .send({
                "username": "utest",
                "password": "test123",
                "conf_password": "test123",
                // no email provided
                "dob": "1995-11-25"
            })
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });

    //This is a test in the test group Register
    it('should register a new user', function (done) {
        //it does a request to the server
        chai.request(server)
        //on the url "something/api/users/register"
            .post('/api/users/register')
            //it sends the following data INSIDE THE BODY
            .send({
                "username": "utest",
                "password": "test123",
                "conf_password": "test123",
                "email": "utest@test.com",
                "dob": "1995-11-25"
            })
            .end(function (err, res) {
                // the answer of the server should have status 200
                res.should.have.status(200);
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
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                //Check that a field exists in the response
                res.body.should.have.property('access_token');
                res.body.should.have.property('refresh_token');
                //Then use it
                // Save the cookie to use it later to retrieve the session
                cookies = res.body.access_token;
                done();
            });
    });

    it('should fail due to wrong pass', function (done) {
        chai.request(server)
            .post('/api/oauth/token')
            .set('Accept', 'application/json')
            .send({
                "grant_type": "password",
                "client_id": "Axxh45u4bdajGDshjk21n",
                "client_secret": "d13e~223~!!@$5dasd",
                "username": "utest@test.com",
                "password": "taf"
            })
            .end(function (err, res) {
                res.should.have.status(403);
                res.should.be.json;
                done();
            });
    });

    it('should fail due to wrong client tokens', function (done) {
        chai.request(server)
            .post('/api/oauth/token')
            .set('Accept', 'application/json')
            .send({
                "grant_type": "password",
                "username": "utest@test.com",
                "password": "test123"
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it('should fail due to missing grant', function (done) {
        chai.request(server)
            .post('/api/oauth/token')
            .set('Accept', 'application/json')
            .send({
                "client_id": "Axxh45u4bdajGDshjk21n",
                "client_secret": "d13e~223~!!@$5dasd",
                "username": "utest@test.com",
                "password": "test123"
            })
            .end(function (err, res) {
                res.should.have.status(501);
                res.should.be.json;
                done();
            });
    });

    it('should get user session for current user', function (done) {
        chai.request(server)
            .get('/api/users/')
            //set the authorization header
            .set('Authorization', 'Bearer ' + cookies)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                // check if property exists
                res.body.should.have.property('username');
                res.body.should.have.property('email');
                //then check if the property is the proper one
                res.body.username.should.equal('utest');
                res.body.email.should.equal('utest@test.com');
                done();
            });
    });
});

describe('challenge flow', function () {

    before(function (done) {

        user.findOne({username: 'utest123'})
            .exec()
            .then(function (result) {
                if (result) {
                    done();
                } else {
                    chai.request(server)
                        .post('/api/users/register')
                        .send({
                            "username": "utest123",
                            "password": "test1234",
                            "conf_password": "test1234",
                            "email": "utest123@test.com",
                            "dob": "1992-10-26"
                        })
                        .end(function (err, res) {
                            res.should.have.status(200);
                            done();
                        });
                }
            });
    });

    it('should get ALL challenges on /flow GET', function (done) {
        chai.request(server)
            .get('/api/des/flow')
            .set('Authorization', 'Bearer ' + cookies)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });

    it('should create a new challenge on /des POST', function (done) {
        chai.request(server)
            .post('/api/des')
            .set('Authorization', 'Bearer ' + cookies)
            .send({'name': 'testaki', 'desc': 'perigrafh lol', 'type': 'food'})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should fail to create a new gauntlent on /gaunlet POST', function (done) {
        chai.request(server)
            .post('/api/des/gaunlet')
            .set('Authorization', 'Bearer ' + cookies)
            .send({})
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });

    it('should create a new gauntlent on /gaunlet POST', function (done) {
        var challengees = [];
        user.findOne({
            "username": "utest123",
            "password": "test1234",
            "conf_password": "test1234",
            "email": "utest123@test.com",
            "dob": "1992-10-26"
        }).exec().then(function (err, res) {
            challengees.push(res._id);
        });

        challenge.findOne({'name': 'testaki', 'desc': 'perigrafh lol', 'type': 'food'})
            .exec()
            .then(function (result) {
                if (result) {
                    chai.request(server)
                        .post('/api/des/gaunlet')
                        .set('Authorization', 'Bearer ' + cookies)
                        .send([challengees, result._id])
                        .end(function (err, res) {
                            res.should.have.status(200);
                            done();
                        });
                }
            });
    });

});
