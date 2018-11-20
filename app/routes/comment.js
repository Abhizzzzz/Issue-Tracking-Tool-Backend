const express = require('express');
const router = express.Router();
const commentController = require("./../controllers/commentController");
const appConfig = require("./../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/comment`;

    // defining routes.


    // to create a comment,req title description,reporter,assignee,status,createdOn,modifiedOn
    app.post(`${baseUrl}/create`,auth.isAuthorize,commentController.createAComment);

    // to get all the comment by issueId,req assignee,authToken
    app.get(`${baseUrl}/get/by/issueId`,auth.isAuthorize,commentController.getCommentByissueId);



}
