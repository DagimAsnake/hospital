const Hospital = require('./models/hospital')
const { HospitalSchema, ReviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Review = require('./models/review')

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must sign in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const hospitals = await Hospital.findById(id)
    if (!hospitals.author.equals(req.user._id)) {
        req.flash('error', 'Not allowed')
        return res.redirect(`/hospitals/${id}`)
    }
    next()
}

module.exports.ValidateHospital = (req, res, next) => {
    const { error } = HospitalSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    } else {
        next()
    }
}

module.exports.ValidateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Not allowed')
        return res.redirect(`/hospitals/${id}`)
    }
    next()
}
