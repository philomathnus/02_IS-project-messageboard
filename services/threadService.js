const thread = require('../models/thread');
const ThreadModel = require('../models/thread');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.encryptPassword = (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, saltRounds);
};

const comparePassword = (plainTextPassword, hashedPassword) => {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
};

exports.createNewThread = async (newThread) => {
    const currentDate = new Date();
    const threadObj = new ThreadModel({
        ...newThread,
        del_password: this.encryptPassword(newThread.del_password),
        created_on: currentDate,
        bumped_on: currentDate,
        replies: []
    });
    return await ThreadModel.create(threadObj);
};

const sortStringDates = (stringDateA, stringDateB) => {
    const dateA = new Date(stringDateA);//Date.parse(stringDateA);
    const dateB = new Date(stringDateB);
    return dateB - dateA;
};

exports.getBoard = async (boardName) => {
    const threadsInBoard = await ThreadModel.find({ board: boardName })
        .sort({ created_on: -1})
        .limit(10)
        .exec()
    for (const thread of threadsInBoard) {
        //keep only the last 3 replies
        const limitedRelies = thread.replies.slice(0, 3);
        thread.replies = limitedRelies;
    }
    return threadsInBoard.sort((a, b) => sortStringDates(a.created_on, b.created_on));
};

exports.deleteThread = async (threadId, delPassword) => {
    const threadToDelete = await ThreadModel.findById(threadId);
    if (threadToDelete) {
        //check password and delete if correct
        if (comparePassword(delPassword, threadToDelete.del_password)) {
            //password correct, proceed to delete
            await ThreadModel.deleteOne({ _id: threadId});
            return 'success';
        } else {
            return 'incorrect password';
        }
    } else {
        return 'Thread not found';
    }
    
};