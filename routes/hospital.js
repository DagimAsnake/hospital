const express = require('express')
const router = express.Router()
const CatchAsync = require('../utils/CatchAsync')
const ExpressError = require('../utils/ExpressError')
const Hospital = require('../models/hospital')
const { HospitalSchema } = require('../schemas.js')
const { isLoggedin, isAuthor, ValidateHospital } = require('../middleware')

const hospitals = require('../controllers/hospital')

router.route('/')
    .get(hospitals.index)
    .post(ValidateHospital, CatchAsync(hospitals.createHospital))

router.get('/new', isLoggedin, hospitals.renderNewForm)

router.route('/:id')
    .get(CatchAsync(hospitals.showHospital))
    .put(isAuthor, ValidateHospital, CatchAsync(hospitals.updateHospital))
    .delete(isAuthor, CatchAsync(hospitals.deleteHospital))

router.get('/:id/edit', isAuthor, CatchAsync(hospitals.renderEditForm))


module.exports = router