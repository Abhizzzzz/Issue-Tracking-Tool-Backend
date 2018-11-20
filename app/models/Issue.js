'use strict'

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let issueSchema = new Schema({
    issueId: {
        type: String,
        default: '',
        // enables us to search the record faster
        index: true,
        unique: true
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    reporter: {
        type: String,
        default: ''
    },
    reporterId: {
        type: String,
        default: ''
    },
    assignee: {
        type: String,
        default: ''
    },
    assigneeId: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('Issue', issueSchema);