const threadService = require('../services/threadService');

exports.createNewThread = async (req, res) => {
    // Write post in database
    const newThread = {
        board: req.params.board,
        text: req.body.text,
        del_password: req.body.delete_password
    }
    const createdThread = await threadService.createNewThread(newThread);
    res.redirect(`/b/${createdThread.board}/`);
};

exports.viewBoard = async (req, res) => {
    // redirect to /b/:board
    const board = await threadService.getBoard(req.params.board);
    res.json(board);
};

exports.deleteThread = async (req, res) => {
    const response = await threadService.deleteThread(req.body.thread_id, req.body.delete_password);
    res.send(response);
};

exports.reportThread = async (req, res) => {
    const response = await threadService.reportThread(req.body.thread_id);
    res.send(response);
};


exports.addReply = async (req, res) => {
    const updatedThread = await threadService.addReply(req.body.thread_id, req.body.text, req.body.delete_password);
    res.redirect(`/b/${updatedThread.board}/`);
};