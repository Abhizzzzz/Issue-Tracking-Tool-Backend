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



let getIssuesByAssignee = (req, res) => {

        // function to validate params.
        let validateParams = () => {
          return new Promise((resolve, reject) => {
            if (check.isEmpty(req.query.assignee)) {
              logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
              let apiResponse = response.generate(true, 'parameters missing.', 403, null)
              reject(apiResponse)
            } else {
              resolve()
            }
          })
        } // end of the validateParams function.
      
        // function to get chats.
        let findIssues = () => {
          return new Promise((resolve, reject) => {
            // creating find query.
            let findQuery = {
              assignee: req.query.assignee.toUpperCase()
            }
      
            IssueModel.find(findQuery)
              .select('-_id -__v -description')
              .sort('-createdOn')
              .lean()
              .exec((err, result) => {
                if(err) {
                  console.log(err)
                  logger.error(err.message, 'Issue Controller: findIssues', 10)
                  let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                  reject(apiResponse)
                } else if (check.isEmpty(result)) {
                  logger.info('No Issues Found', 'Issue Controller: findIssues')
                  let apiResponse = response.generate(true, 'No Issues Found', 404, null)
                  reject(apiResponse)
                } else {
                  console.log('Issues found and listed.')
      
                  // reversing array.
                  // let reverseResult = result.reverse();
                  resolve(result)
                }
              })
          })
        } // end of the findChats function.
      
        // making promise call.
        validateParams()
          .then(findIssues)
          .then((result) => {
            let apiResponse = response.generate(false, 'All Issues Listed', 200, result)
            console.log(apiResponse);
            res.send(apiResponse)
          })
          .catch((error) => {
            res.send(error)
          })
      

}




let createAIssue = (req, res) => {

    let validatingInputs = () =>{
        return new Promise((resolve,reject) =>{
            if(req.body.title && req.body.description && req.body.reporter && req.body.assignee && req.body.status){
                    resolve(req);
            }
            else{
                let apiResponse = response.generate(true,"Body parameter are missing",400,null);
                reject(apiResponse);
            }
        });
    }; // end of validateInputs

    let validateAssignee = () =>{
      return new Promise((resolve,reject) =>{
        let name = req.body.assignee.split(" ");
        let query = {
          firstName: name[0].toUpperCase(),
          lastName: name[1].toUpperCase()
        }
        UserModel.findOne(query).exec((err,assigneeDetails) =>{
          if(err){
            logger.error(err.message,"issueController => createIssue()",5);
            let apiResponse = response.generate(true,"Failed to create issue",500,null);
            reject(apiResponse);

        }
        // user is not present in the DB 
        else if(check.isEmpty(assigneeDetails)){
          let apiResponse = response.generate(true,"No such assignee found -> Tell the assignee to register first",404,null);
          reject(apiResponse);

        }
        // user is present already in the DB
        else{
            req.body.assigneeId = assigneeDetails.userId;
            resolve(req);
        }

        });
      });
      
    };


    let createIssue = () =>{
        return new Promise((resolve,reject) =>{
            IssueModel.findOne({'title': req.body.title.toUpperCase()}).exec((err,issueDetails) =>{
                if(err){
                    logger.error(err.message,"issueController => createIssue()",5);
                    let apiResponse = response.generate(true,"Failed to create issue",500,null);
                    reject(apiResponse);

                }
                // user is not present in the DB 
                else if(check.isEmpty(issueDetails)){
                    let newIssue = new IssueModel({
                          issueId: shortid.generate(),
                          title: req.body.title.toUpperCase(),
                          description: req.body.description,
                          reporter: req.body.reporter.toUpperCase(),
                          reporterId: req.body.reporterId,
                          assignee: req.body.assignee.toUpperCase(),
                          assigneeId: req.body.assigneeId,
                          status: req.body.status.toLowerCase(),
                          createdOn: time.now()
                    });

                    newIssue.save((err,newIssueDetails) =>{
                        if(err){
                            logger.error(err.message,"issueController => createIssue()",5);
                            let apiResponse = response.generate(true,"Failed to create new issue",500,null);
                            reject(apiResponse);
                        }
                        else{
                            let newIssueObj = newIssueDetails.toObject();
                            resolve(newIssueObj);
                        }
                    });

                }
                // user is present already in the DB
                else{
                    let apiResponse = response.generate(true,'Same issue title already exists',403,null);
                    reject(apiResponse);
                }

            });


        });
    }; // end of createUser
  
    validatingInputs(req,res).then(validateAssignee).then(createIssue).then((newIssueDetails) =>{
        delete newIssueDetails._id;
        delete newIssueDetails.__v;
        
        
        let apiResponse = response.generate(false,"New issue added successfully",200,newIssueDetails);
        res.send(apiResponse);
    }).catch((err) =>{
        console.log(err);
        res.send(err);
    });

}


let getIssuesByTitle = (req, res) => {

    // function to validate params.
    let validateParams = () => {
      return new Promise((resolve, reject) => {
        if (check.isEmpty(req.query.title)) {
          logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
          let apiResponse = response.generate(true, 'parameters missing.', 403, null)
          reject(apiResponse)
        } else {
          resolve()
        }
      })
    } // end of the validateParams function.
  
    // function to get chats.
    let findIssues = () => {
      return new Promise((resolve, reject) => {
        // creating find query.
        let findQuery = {
          title: req.query.title.toUpperCase()
        }
  
        IssueModel.find(findQuery)
          .select('-_id -__v -description')
          .sort('-createdOn')
          .lean()
          .exec((err, result) => {
            if(err) {
              console.log(err)
              logger.error(err.message, 'Issue Controller: findIssues', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Issues Found', 'Issue Controller: findIssues')
              let apiResponse = response.generate(true, 'No Issues Found', 404, null)
              reject(apiResponse)
            } else {
              console.log('Issues found and listed.')
  
              // reversing array.
              let reverseResult = result.reverse()
  
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams()
      .then(findIssues)
      .then((result) => {
        let apiResponse = response.generate(false, 'Issues Found And Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  

}

let getIssuesByReporter = (req, res) => {

    // function to validate params.
    let validateParams = () => {
      return new Promise((resolve, reject) => {
        if (check.isEmpty(req.query.reporter)) {
          logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
          let apiResponse = response.generate(true, 'parameters missing.', 403, null)
          reject(apiResponse)
        } else {
          resolve()
        }
      })
    } // end of the validateParams function.
  
    // function to get chats.
    let findIssues = () => {
      return new Promise((resolve, reject) => {
        // creating find query.
        let findQuery = {
            reporter: req.query.reporter.toUpperCase(),
            assignee: req.query.assignee.toUpperCase()
        }
  
        IssueModel.find(findQuery)
          .select('-_id -__v -description')
          .sort('-createdOn')
          .lean()
          .exec((err, result) => {
            if(err) {
              console.log(err)
              logger.error(err.message, 'Issue Controller: findIssues', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Issues Found', 'Issue Controller: findIssues')
              let apiResponse = response.generate(true, 'No Issues Found', 404, null)
              reject(apiResponse)
            } else {
              console.log('Issues found and listed.')
  
              // reversing array.
              // let reverseResult = result.reverse()
  
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams()
      .then(findIssues)
      .then((result) => {
        let apiResponse = response.generate(false, 'Issues Found And Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  

}

let getIssuesByStatus = (req, res) => {

    // function to validate params.
    let validateParams = () => {
      return new Promise((resolve, reject) => {
        if (check.isEmpty(req.query.status)) {
          logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
          let apiResponse = response.generate(true, 'parameters missing.', 403, null)
          reject(apiResponse)
        } else {
          resolve()
        }
      })
    } // end of the validateParams function.
  
    // function to get chats.
    let findIssues = () => {
      return new Promise((resolve, reject) => {
        // creating find query.
        let findQuery = {
            status: req.query.status.toLowerCase(),
            assignee: req.query.assignee.toUpperCase()
        }
  
        IssueModel.find(findQuery)
          .select('-_id -__v -description')
          .sort('-createdOn')
          .lean()
          .exec((err, result) => {
            if(err) {
              console.log(err)
              logger.error(err.message, 'Issue Controller: findIssues', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Issues Found', 'Issue Controller: findIssues')
              let apiResponse = response.generate(true, 'No Issues Found', 404, null)
              reject(apiResponse)
            } else {
              console.log('Issues found and listed.')
  
              // reversing array.
              let reverseResult = result.reverse()
  
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams()
      .then(findIssues)
      .then((result) => {
        let apiResponse = response.generate(false, 'Issues Found And Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  

}



let getIssueById = (req, res) => {
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
    let findIssues = () => {
      return new Promise((resolve, reject) => {
        // creating find query.
        let findQuery = {
            issueId: req.query.issueId
        }
  
        IssueModel.findOne(findQuery)
          .select('-_id -__v')
          .lean()
          .exec((err, result) => {
            if(err) {
              console.log(err)
              logger.error(err.message, 'Issue Controller: findIssues', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Issues Found', 'Issue Controller: findIssues')
              let apiResponse = response.generate(true, 'No Issue Found', 404, null)
              reject(apiResponse)
            } else {
              console.log('Issue found and listed.')
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams()
      .then(findIssues)
      .then((result) => {
        let apiResponse = response.generate(false, 'Issue Found And Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  

}



// edit issue
let editIssue = (req,res) =>{

  let options = req.body;
  options.modifiedOn = time.now();
  // body parameter which we pass for editing
  console.log(options);
  // we are passing the whole body parameter which is to be edited and setting multi: true helps us to edit multiple records
  IssueModel.findOneAndUpdate({'issueId': req.params.issueId}, options, {new: true})
  .select('-_id -__v')
  .exec((err,result) =>{
      if(err){
          logger.error(err.message,'Issue Controller->editIssue',10)
          let apiResponse = response.generate(true,'Error occured',500,null);
          res.send(apiResponse);
      }
      else if(check.isEmpty(result)){
          logger.info('No Issue found!','Issue Controller->editIssue');
          let apiResponse = response.generate(true,'No Issue found!',400,null);
          res.send(apiResponse);
      }
      else{
          logger.info('Issue edited successfully','Issue Controller->editIssue',5);
          let apiResponse = response.generate(false,'Issue edited successfully',200,result);
          res.send(apiResponse);
      }
  })
}





module.exports = {

    getIssuesByAssignee: getIssuesByAssignee,
    createAIssue: createAIssue,
    getIssuesByTitle: getIssuesByTitle,
    getIssuesByReporter: getIssuesByReporter,
    getIssuesByStatus: getIssuesByStatus,
    getIssueById: getIssueById,
    editIssue: editIssue
    

}// end exports