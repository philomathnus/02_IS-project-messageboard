const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { beforeEach } = require('mocha');
const ThreadModel = require('../models/thread');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    beforeEach((done) => {
        ThreadModel.deleteMany({})
            .then(() => done())
            .catch(err => console.log(err));
    });

    test('Creating a new thread: POST request to /api/threads/{board}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/threads/testboard')
            .send({
                text: 'Test new thread creation',
                delete_password: 'topsecret'
            })
            .end(async (err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                const threadFromDB = await ThreadModel.findOne({board: 'testboard'});
                assert.exists(threadFromDB);
                assert.equal(threadFromDB.text, 'Test new thread creation');
                done();
            });
    });
});
