const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')
const User = require('./user')

const hospitalSchema = new Schema({
    name: String,
    image: String,
    phone: Number,
    website: String,
    location: String,
    description: String,
    beds: Number,
    owner: String,
    category: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


hospitalSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})



module.exports = mongoose.model('Hospital', hospitalSchema)
