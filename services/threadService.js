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
    const created = await ThreadModel.create(threadObj);
};