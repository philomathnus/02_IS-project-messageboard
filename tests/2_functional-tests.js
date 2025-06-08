const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { beforeEach } = require('mocha');
const ThreadModel = require('../models/thread');
const {encryptPassword} = require('../services/threadService');
const Reply = require('../models/reply');

chai.use(chaiHttp);

const hashedDelThreadPassword = encryptPassword('topsecret');
const hashedDelReplyPassword = encryptPassword('del_reply');

const replies = [
    new Reply('first replay',hashedDelReplyPassword),
    new Reply('second replay', hashedDelReplyPassword),
    new Reply('third replay', hashedDelReplyPassword),
    new Reply('forth replay', hashedDelReplyPassword)
];

const threads = [
    new ThreadModel({ board: 'testboard', text: 'thread1', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-17T03:24:00'), bumped_on: new Date('1995-12-17T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread2', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-18T03:24:00'), bumped_on: new Date('1995-12-18T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread3', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-19T03:24:00'), bumped_on: new Date('1995-12-19T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread4', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-20T03:24:00'), bumped_on: new Date('1995-12-20T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread5', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-21T03:24:00'), bumped_on: new Date('1995-12-21T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread6', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-22T03:24:00'), bumped_on: new Date('1995-12-22T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread7', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-23T03:24:00'), bumped_on: new Date('1995-12-23T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread8', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-24T03:24:00'), bumped_on: new Date('1995-12-24T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread9', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-25T03:24:00'), bumped_on: new Date('1995-12-25T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread10', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-26T03:24:00'), bumped_on: new Date('1995-12-26T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread11', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-27T03:24:00'), bumped_on: new Date('1995-12-27T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread12', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-28T03:24:00'), bumped_on: new Date('1995-12-28T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread13', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-29T03:24:00'), bumped_on: new Date('1995-12-29T03:24:00'), replies: replies }),
    new ThreadModel({ board: 'testboard', text: 'thread14', del_password: hashedDelThreadPassword, created_on: new Date('1995-12-30T03:24:00'), bumped_on: new Date('1995-12-30T03:24:00'), replies: replies })
];

let threadOne;

suite('Functional Tests', function () {
    beforeEach((done) => {
        ThreadModel.deleteMany({})
            .then(() => {
                ThreadModel.insertMany(threads)
                    .then(() => {
                        ThreadModel.findOne({text: 'thread1'})
                        .then((foundThreadData) => {
                            threadOne = foundThreadData;
                            done();
                        })
                        .catch(err => console.log(err));
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
                    assert.equal(res.body.length, 10, 'There should be 10 threads in the response');
                    assert.equal(res.body[0].text, 'thread14');
                    assert.equal(res.body[0].replies.length, 3, 'There should be only 3 replies per thread');
                    done();
                }
            });
    });

    test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
        chai
            .request(server)
            .keepOpen()
            .delete('/api/threads/testboard')
            .send({
                thread_id: threadOne._id,
                delete_password: 'wrong_password'
            })
            .end(async (err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text, 'incorrect password');
                done();
            });
    });

    test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', (done) => {
        chai
            .request(server)
            .keepOpen()
            .delete('/api/threads/testboard')
            .send({
                thread_id: threadOne._id,
                delete_password: 'topsecret'
            })
            .end(async (err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text, 'success');
                done();
            });
    });

    test('Reporting a thread: PUT request to /api/threads/{board}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .put('/api/threads/testboard')
            .send({
                thread_id: threadOne._id
            })
            .end(async (err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text, 'reported');
                done();
            });
    });

    test('Creating a new reply: POST request to /api/replies/{board}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/replies/testboard')
            .send({
                thread_id: threadOne._id,
                text: 'My reply',
                delete_password: 'del_reply'
            })
            .end(async (err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                const threadFromDB = await ThreadModel.findById({_id: threadOne._id});
                assert.exists(threadFromDB);
                assert.equal(threadFromDB.replies.length, 5, 'There should be five replies after adding one');
                done();
            });
    });

});
