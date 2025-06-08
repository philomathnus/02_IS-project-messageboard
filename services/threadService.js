const Reply = require('../models/reply');
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
        .sort({ bumped_on: -1 })
        .limit(10)
        .select('-delete_password -reported')
        .exec();
    for (const thread of threadsInBoard) {
        //keep only the last 3 replies
        const limitedRelies = thread.replies.slice(0, 3);
        thread.replies = limitedRelies;
    }
    return threadsInBoard.sort((a, b) => sortStringDates(a.bumped_on, b.bumped_on));
};

exports.deleteThread = async (threadId, delPassword) => {
    const threadToDelete = await ThreadModel.findById(threadId);
    if (threadToDelete) {
        //check password and delete if correct
        if (comparePassword(delPassword, threadToDelete.del_password)) {
            //password correct, proceed to delete
            await ThreadModel.deleteOne({ _id: threadId });
            return 'success';
        } else {
            return 'incorrect password';
        }
    } else {
        return 'Thread not found';
    }
};

exports.reportThread = async (threadId) => {
    const reportedThread = await ThreadModel.findByIdAndUpdate(threadId, { reported: true }, { new: true });
    if (reportedThread.reported) {
        return 'reported';
    } else {
        return 'could not report';
    }
};

exports.addReply = async (threadId, text, deletePassword) => {
    const newReply = new Reply(text, this.encryptPassword(deletePassword));
    const updatedThread = await ThreadModel.findByIdAndUpdate({ _id: threadId }, { $push: { replies: newReply }, bumped_on: new Date() }, { new: true }).select('-delete_password -reported');
    return updatedThread;
};

exports.getThread = async (threadId) => {
    const thread = await ThreadModel.findById({ _id: threadId }).select('-delete_password -reported');
    return thread;
};

exports.deleteReply = async (threadId, replyId, deletePassword) => {
    const thread = await ThreadModel.findById({_id: threadId});
    const reply = thread.replies.filter(reply => reply._id === replyId)[0];
    if (comparePassword(deletePassword, reply.delete_password)) {
        await ThreadModel.updateOne({_id: threadId, 'replies._id': reply._id}, {$set: {'replies.$.text':  '[deleted]'}});
        return 'success';
    } else {
        return 'incorrect password';
    }
};

exports.reportReply = async (threadId, replyId) => {
    const reportedThread = await ThreadModel.findOneAndUpdate({_id: threadId, 'replies._id': replyId}, {$set: {'replies.$.reported':  true}}, {new: true});
    const reply = reportedThread.replies.filter(reply => reply._id === replyId)[0];
    if (reply.reported) {
        return 'reported';
    } else {
        return 'could not report';
    }
};