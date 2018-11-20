const express = require('express');
const router = express.Router();
const s3ImageUploadController = require('./../controllers/s3ImageUploadController');
const appConfig = require("./../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/s3ImageUpload`;

    // defining routes.


    // to get all the issues assigned to a particular assignee,req assignee,authToken
    app.get(`${baseUrl}/get_signature`,auth.isAuthorize,s3ImageUploadController.uploadImageS3);

    


}
