const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadModel = new Schema(
    {
        board: {
            type: Schema.Types.String,
            required: true
        },
        text: {
            type: Schema.Types.String,
            required: true
        },
        del_password: {
            type: Schema.Types.String,
            required: true
        },
        reported: {
            type: Schema.Types.Boolean,
            detault: false
        },
        created_on: {
            type: Schema.Types.Date,
            required: true
        },
        bumped_on: {
            type: Schema.Types.Date
        },
        replies: {
            type: Schema.Types.Array,
            default: []
        }
    },
    {
        collection: 'threads'
    }
);

module.exports = mongoose.model('Thread', threadModel);
