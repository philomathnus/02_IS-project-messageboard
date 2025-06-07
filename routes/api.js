'use strict';
const { createNewThread, viewBoard, deleteThread } = require('../controllers/threadController');

module.exports = function (app) {
  app.route('/api/threads/:board')
  .get(viewBoard)
  .post(createNewThread)
  .delete(deleteThread);

  //app.route('/api/replies/:board');

};
