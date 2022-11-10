const Joi = require('joi')

module.exports.HospitalSchema = Joi.object({
    hospital: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        phone: Joi.number().required(),
        website: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        beds: Joi.number().required().min(0),
        owner: Joi.string().required().valid('Private', 'Public', 'Non-Profitable Org'),
        category: Joi.string().required()
    }).required()
})

module.exports.ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
