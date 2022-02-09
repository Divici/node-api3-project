const UserModel = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  const timestamp = new Date().toLocaleString();
  const requestMethod = req.method;
  const requestUrl = req.originalUrl;
  console.log(`[${timestamp}] ${requestMethod} to ${requestUrl}`);
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try{
    const user = await UserModel.getById(req.params.id)
    if(!user){
      res.status(404).json({message: 'User does not exist'})
    }
    else{
      req.user = user;
      next()
    }
  }
  catch (err){
    res.status(500).json({message: 'Unable to find user'})
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  console.log('validateUser middleware');
  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  console.log('validatePost middleware');
  next();
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}