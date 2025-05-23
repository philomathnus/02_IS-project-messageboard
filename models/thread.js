const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadModel = new Schema(
    {
        _id: {
            type: Schema.Types.String
        },
        text: {
            type: Schema.Types.String,
            required: true
        },
        board: {
            type: Schema.Types.String,
            required: true
        },
        del_password: {
            type: Schema.Types.String,
            required: true
        },
        created_on: {
            type: Schema.Types.Date
        },
        replies: {
            type: [Schema.Types.String]
        }
    }
);

module.exports = mongoose.model('Thread', threadModel);
