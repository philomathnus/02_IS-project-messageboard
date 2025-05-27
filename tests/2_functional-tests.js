const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { beforeEach } = require('mocha');
const ThreadModel = require('../models/thread');

chai.use(chaiHttp);

const threads = [
    new ThreadModel({ board: 'testboard', text: 'thread1', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread2', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread3', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread4', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread5', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread6', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread7', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread8', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread9', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread10', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread11', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread12', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread13', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] }),
    new ThreadModel({ board: 'testboard', text: 'thread14', del_password: 'topsecret', created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: ['first reply', 'second reply', 'third reply', 'forth reply'] })
];

suite('Functional Tests', function () {
    beforeEach((done) => {
        ThreadModel.deleteMany({})
            .then(() => {
                ThreadModel.insertMany(threads)
                    .then(() => {
                        done();
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    });

    test('Creating a new thread: POST request to /api/threads/{board}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/threads/newtestboard')
            .send({
                text: 'Test new thread creation',
                delete_password: 'topsecret'
            })
            .end(async (err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                const threadFromDB = await ThreadModel.findOne({ board: 'newtestboard' });
                assert.exists(threadFromDB);
                assert.equal(threadFromDB.text, 'Test new thread creation');
                done();
            });
    });

     test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .get('/api/threads/testboard')
            .end((err, res) => {
                if (res.error) {
                    console.log(res.error);
                } else {
                    assert.equal(res.status, 200, 'Response status should be 200');
                    done();
                }
            });
    });
});
