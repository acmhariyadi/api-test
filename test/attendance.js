let chai = require('chai');
let chaiHttp = require('chai-http');
var should = require("should");

chai.use(chaiHttp);

describe('API Testing', () => {
    it('it should receive checkin successfully', function (done) {
        var user = {
            userId: 'makanmakan',
            check_in_location: '-6.175, 106.8286',
            check_in_time: '08:30',
            date: '2021-08-01'
        };

        chai.request('localhost:9812')
            .post('/attendance')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.be.true()
                done();
            });
    });

    it('it should receive checkin successfully', function (done) {
        var user = {
            userId: 'makan2',
            notes: 'others',
            check_in_location: '-6.175, 106.8286',
            check_in_time: '10:30',
            date: '2021-08-01'
        };

        chai.request('localhost:9812')
            .post('/attendance')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.be.true()
                done();
            });
    });

    it('it should receive list attendance by user', function (done) {
        chai.request('localhost:9812')
            .post('/attendance/makanmakan')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.be.true()
                done();
            });
    });

    it('it should receive all list attendance', function (done) {
        chai.request('localhost:9812')
            .get('/attendance')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.be.true()
                done();
            });
    });

    it('it should receive checkout successfully', function (done) {
        var user = {
            checkOutLocation: '-6.175, 106.8286',
            checkOutTime: '08:30',
            date: '2021-08-01'
        };
        chai.request('localhost:9812')
            .put('/attendance/makanmakan')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.be.true();
                done();
            });
    });
});
