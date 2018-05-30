// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for pens
const Pen = require('../models/pen')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /pens
router.get('/pens', requireToken, (req, res) => {
  Pen.find()
    .then(pens => {
      // `pens` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return pens.map(pen => pen.toObject())
    })
    // respond with status 200 and JSON of the pens
    .then(pens => res.status(200).json({ pens: pens }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /pens/5a7db6c74d55bc51bdf39793
router.get('/pens/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Pen.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "pen" JSON
    .then(pen => res.status(200).json({ pen: pen.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /pens
router.post('/pens', requireToken, (req, res) => {
  // set owner of new pen to be current user
  req.body.pen.owner = req.user.id

  Pen.create(req.body.pen)
    // respond to succesful `create` with status 201 and JSON of new "pen"
    .then(pen => {
      res.status(201).json({ pen: pen.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /pens/5a7db6c74d55bc51bdf39793
router.patch('/pens/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.pen.owner

  Pen.findById(req.params.id)
    .then(handle404)
    .then(pen => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, pen)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.pen).forEach(key => {
        if (req.body.pen[key] === '') {
          delete req.body.pen[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return pen.update(req.body.pen)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /pens/5a7db6c74d55bc51bdf39793
router.delete('/pens/:id', requireToken, (req, res) => {
  Pen.findById(req.params.id)
    .then(handle404)
    .then(pen => {
      // throw an error if current user doesn't own `pen`
      requireOwnership(req, pen)
      // delete the pen ONLY IF the above didn't throw
      pen.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
