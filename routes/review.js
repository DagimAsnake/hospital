const express = require('express')
const router = express.Router({ mergeParams: true })
const CatchAsync = require('../utils/CatchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const { ReviewSchema } = require('../schemas.js')
const Hospital = require('../models/hospital')
const { ValidateReview, isLoggedin, isReviewAuthor } = require('../middleware')

const reviews = require('../controllers/review')

router.post('/', isLoggedin, ValidateReview, CatchAsync(reviews.creatReviews))

router.delete('/:reviewId', isLoggedin, isReviewAuthor, CatchAsync(reviews.deleteReviews))

module.exports = router