const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Creating a new thread: POST request to /api/threads/{board}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/threads/testboard')
            .send({
                text: 'Test new thread creation',
                delete_password: 'topsecret'
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
});
