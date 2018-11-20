'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let commentSchema = new Schema({
    commentId: {
        type: String,
        default: '',
        // enables us to search the record faster
        index: true,
        unique: true
    },
    issueId: {
        type: String,
        default: ''
    },
    commenterName: {
        type: String,
        default: ''
    },
    comment: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('Comment', commentSchema);