const ThreadModel = require('../models/thread');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const encryptPassword = (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, saltRounds);
};

const comparePassword = (plainTextPassword, hashedPassword) => {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
};

exports.createNewThread = async (newThread) => {
    const currentDate = new Date();
    const threadObj = new ThreadModel({
        ...newThread,
        del_password: encryptPassword(newThread.del_password),
        created_on: currentDate,
        bumped_on: currentDate,
        replies: []
    });
    
    return await ThreadModel.create(threadObj);
};

exports.getBoard = async (boardName) => {
    const threadsInBoard = await ThreadModel.find({ board: boardName })
        .sort({ created_on: -1})
        .limit(10)
        .exec()
    return threadsInBoard;
};