const express = require('express');
const router = express.Router();
const issueController = require('./../controllers/issueController');
const appConfig = require("./../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/issue`;

    // defining routes.


    // to get all the issues assigned to a particular assignee,req assignee,authToken
    app.get(`${baseUrl}/get/by/assignee`,auth.isAuthorize,issueController.getIssuesByAssignee);

    // to create a issue,req title description,reporter,assignee,status,createdOn,modifiedOn
    app.post(`${baseUrl}/create`,auth.isAuthorize,issueController.createAIssue);

    // to get all the issues by title,req assignee,authToken
    app.get(`${baseUrl}/get/by/title`,auth.isAuthorize,issueController.getIssuesByTitle);

    // to get all the issues by reporter,req assignee,authToken
    app.get(`${baseUrl}/get/by/reporter`,auth.isAuthorize,issueController.getIssuesByReporter);

    // to get all the issues by status,req assignee,authToken
    app.get(`${baseUrl}/get/by/status`,auth.isAuthorize,issueController.getIssuesByStatus);

    // to get all the issue by issueId,req assignee,authToken
    app.get(`${baseUrl}/get/by/issueId`,auth.isAuthorize,issueController.getIssueById);

    app.put(baseUrl+'/:issueId/edit',auth.isAuthorize,issueController.editIssue)


}
