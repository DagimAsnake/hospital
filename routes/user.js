const express = require('express')
const router = express.Router()
const User = require('../models/user')
const CatchAsync = require('../utils/CatchAsync')
const passport = require('passport')

const user = require('../controllers/user')

router.route('/register')
    .get(user.renderRegister)
    .post(CatchAsync(user.register))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout)

module.exports = router