'use strict';
const { createNewThread, viewBoard } = require('../controllers/threadController');

module.exports = function (app) {
  app.route('/api/threads/:board')
  .get(viewBoard)
  .post(createNewThread);

  //app.route('/api/replies/:board');

};
