"use strict";
//process.env.NODE_ENV = 'test';
var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);
//TODO change the code below with what we want to test
//Obviously is copied from fably

describe('stories', function () {
    it('should get the first 10 stories on /stories GET', function (done) {
        chai.request(server)
            .get('/stories')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                done();
            });
    });
    it('should get specific story /stories/:id GET', function (done) {
        chai.request(server)
            .get('/stories/5816b687bccdb29c24f1316d')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                done();
            });
    });
    it('should get full content on a specific story /stories/full/:id GET', function (done) {
        chai.request(server)
            .get('/stories/full/5816b687bccdb29c24f1316d')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('content');
                res.body.content.should.be.a('object');
                done();
            });
    });
    it('should get content on a specific story /stories/content/:id GET', function (done) {
        chai.request(server)
            .get('/stories/content/5816b687bccdb29c24f1316d')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('images');
                res.body.images.should.be.a('array');
                done();
            });
    });
});