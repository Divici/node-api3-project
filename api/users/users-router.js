const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const {validateUserId, validateUser, validatePost} = require('../middleware/middleware')
const UserModel = require('./users-model')
const PostModel = require('../posts/posts-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  UserModel.get()
    .then(users => {
      res.json(users)
    })
    .catch(next);
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  UserModel.insert({name: req.name})
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  UserModel.update(req.params.id, {name: req.name})
    .then(rows => {
      return UserModel.getById(req.params.id)
    })
    .then(user=>{
      res.json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await UserModel.remove(req.params.id)
    res.json(req.user)
  }
  catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const result = await UserModel.getUserPosts(req.params.id)
    res.json(result)
  }
  catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    const result = await PostModel.insert({
      user_id : req.params.id,
      text : req.text
    })
    res.status(201).json(result)
  }
  catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) =>{
  res.status(err.status || 500).json({
    message: err.message,
  stack: err.stack})
})

// do not forget to export the router
module.exports = router;