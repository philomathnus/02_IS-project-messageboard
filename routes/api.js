'use strict';
const { createNewThread, viewBoard, deleteThread, reportThread, addReply, getThread: viewThread, viewCompleteThread, getThread, deleteReply, reportReply } = require('../controllers/threadController');


module.exports = function (app) {
  app.route('/api/threads/:board')
    .get(viewBoard)
    .post(createNewThread)
    .delete(deleteThread)
    .put(reportThread);

   app.route('/api/replies/:board')
    .post(addReply)
    .get(getThread)
    .delete(deleteReply)
    .put(reportReply);

};
