const threadService = require('../services/threadService');

exports.createNewThread = async (req, res) => {
    // Write post in database
    const newThread = {
        board: req.params.board,
        text: req.body.text,
        del_password: req.body.delete_password
    }
    const createdThread = await threadService.createNewThread(newThread);
    // redirect to /b/:board
    res.redirect(`/b/${req.params.board}`);
};