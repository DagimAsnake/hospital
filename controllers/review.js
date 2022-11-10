const Hospital = require('../models/hospital')
const Review = require('../models/review')

module.exports.creatReviews = async (req, res) => {
    const { id } = req.params
    const hospital = await Hospital.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    hospital.reviews.push(review)
    await review.save()
    await hospital.save()
    req.flash('success', 'Created a review')
    res.redirect(`/hospitals/${hospital._id}`)
}

module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params
    await Hospital.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted your review')
    res.redirect(`/hospitals/${id}`)
}