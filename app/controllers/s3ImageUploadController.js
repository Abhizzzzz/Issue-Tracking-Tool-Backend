'use strict';
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib');

var FroalaEditor = require('../../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor');


let uploadImageS3 = (req, res) => {

       var configs = {
           bucket: 'issue-tracking-tool-uploads',
           region: 'ap-south-1',
   
           // The folder where to upload the images.
           keyStart: 'issue',
   
           // File access.
           acl: 'public-read',
   
           // AWS keys.
           accessKey: 'AKIAJDZZBG7N7PLPJV7A',
           secretKey: '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'
       }
   
       let s3Hash = FroalaEditor.S3.getHash(configs);
   
       res.send(s3Hash);
       console.log("Uploaded");
       console.log(s3Hash);
 
}

module.exports = {
    uploadImageS3: uploadImageS3
};
   


