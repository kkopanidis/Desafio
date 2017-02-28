"use strict";
//process.env.NODE_ENV = 'test';
var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var user = require('../models/user');
var before = require("mocha").before;

chai.use(chaiHttp);

var userid = 0; //logged in user
var cookies;

//This is a test group named register
describe('Register', function () {

    //This should launch before the tests of this group
    before(function (done) {
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
                // what id?!
                // userid = res.body.id; // pws pairnw to active user id?
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
