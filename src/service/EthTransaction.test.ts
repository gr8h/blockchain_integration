require('dotenv').config();

const app = require('../api/index')
const supertest = require('supertest')
const request = supertest(app)
const assert = require('assert');

it('Test Get transaction Sucessful', async done => {
    const response = await request.post('/')
        .send(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "get",
                "params": ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd", "Eth"]
            }
        )
    .expect(200)
    .expect('Content-Type', 'application/json')
    .expect(function(res) {
        assert(res.body.hasOwnProperty('amount'));
        assert(res.body.hasOwnProperty('from'));
        assert(res.body.hasOwnProperty('hash'));
        assert(res.body.hasOwnProperty('to'));
        assert(res.body.hasOwnProperty('fee'));
  })
  .end(function(err, res) {
    if (err) throw err;
  });
    done()
});

it('Test Get transaction Error', async done => {
    const response = await request.post('/')
        .send(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "get",
                "params": ["0x2baacbc52190c6b52381c663a695d4b1d6afba8ed398406755f6fbd9a49005bd_bad", "Eth"]
            }
        )
    .expect(200)
    .expect('Content-Type', 'application/json')
    .expect(function(res) {
        assert(res.body.hasOwnProperty('error'));
    })
    .end(function(err, res) {
        if (err) throw err;
    });
    done()
});

it('Test Post transaction', async done => {
    const response = await request.post('/')
        .send(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "send",
                "params": ["0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0", "0.001", "Eth"]
            }
        )
    .expect(200)
    .expect('Content-Type', 'application/json')
    .end(function(err, res) {
        if (err) throw err;
    });
    done()
});

it('Test Post transaction Wrong Type', async done => {
    const response = await request.post('/')
        .send(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "send",
                "params": ["0x5A3Da324Bf0470d18C808fcC974a428558A41Ef0", "0.001", "XRP"]
            }
        )
    .expect(200)
    .expect('Content-Type', 'application/json')
    .expect(function(res) {
        assert(res.body.hasOwnProperty('error'));
    })
    .end(function(err, res) {
        if (err) throw err;
    });
    done()
});