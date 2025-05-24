'use strict';
const {createNewThread} = require('../controllers/threadController');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(createNewThread);
    
  app.route('/api/replies/:board');

};
