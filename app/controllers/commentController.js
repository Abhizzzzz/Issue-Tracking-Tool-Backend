const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib');
const tokenLib = require('../libs/tokenLib');

/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');
const IssueModel = mongoose.model('Issue');
const CommentModel = mongoose.model('Comment');

let createAComment = (req, res) => {

    let validatingInputs = () =>{
        return new Promise((resolve,reject) =>{
            if(req.body.issueId && req.body.commenterName && req.body.comment){
                    resolve(req);
            }
            else{
                let apiResponse = response.generate(true,"Body parameter are missing",400,null);
                reject(apiResponse);
            }
        });
    }; // end of validateInputs

    let createComment = () =>{
        return new Promise((resolve,reject) =>{
                
                    let newComment = new CommentModel({
                          commentId: shortid.generate(),
                          issueId: req.body.issueId,
                          commenterName: req.body.commenterName,
                          comment: req.body.comment,
                          createdOn: time.now()
                    });

                    newComment.save((err,newCommentDetails) =>{
                        if(err){
                            logger.error(err.message,"issueController => createComment()",5);
                            let apiResponse = response.generate(true,"Failed to create new comment",500,null);
                            reject(apiResponse);
                        }
                        else{
                            let newCommentObj = newCommentDetails.toObject();
                            resolve(newCommentObj);
                        }
                    });

            


        });
    }; // end of createUser
  
    validatingInputs(req,res).then(createComment).then((newCommentDetails) =>{
        delete newCommentDetails._id;
        delete newCommentDetails.__v;
        
        let apiResponse = response.generate(false,"New comment added successfully",200,newCommentDetails);
        res.send(apiResponse);
    }).catch((err) =>{
        console.log(err);
        res.send(err);
    });

}


let getCommentByissueId = (req, res) => {
    // function to validate params.
    let validateParams = () => {
      return new Promise((resolve, reject) => {
        if (check.isEmpty(req.query.issueId)) {
          logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
          let apiResponse = response.generate(true, 'parameters missing.', 403, null)
          reject(apiResponse)
        } else {
          resolve()
        }
      })
    } // end of the validateParams function.
  
    // function to get chats.
    let findComments = () => {
      return new Promise((resolve, reject) => {
        // creating find query.
        let findQuery = {
            issueId: req.query.issueId
        }
  
        CommentModel.find(findQuery)
          .select('-_id -__v')
          .sort('-createdOn')
          .lean()
          .exec((err, result) => {
            if(err) {
              console.log(err)
              logger.error(err.message, 'Issue Controller: findIssues', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Comments Found', 'Issue Controller: findIssues')
              let apiResponse = response.generate(true, 'No Comments Found', 404, null)
              reject(apiResponse)
            } else {
              console.log('Comments found and listed.')
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams()
      .then(findComments)
      .then((result) => {
        let apiResponse = response.generate(false, 'Comments Found And Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  

}

module.exports = {
    createAComment: createAComment,
    getCommentByissueId: getCommentByissueId
};