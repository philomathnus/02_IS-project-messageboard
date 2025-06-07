'use strict';
const { createNewThread, viewBoard, deleteThread, reportThread } = require('../controllers/threadController');

module.exports = function (app) {
  app.route('/api/threads/:board')
  .get(viewBoard)
  .post(createNewThread)
  .delete(deleteThread)
  .put(reportThread);

  //app.route('/api/replies/:board');

};
