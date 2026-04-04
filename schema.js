const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),

    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .allow("", null),

    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null)
    })
  }).required()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required()
  }).required()
});

module.exports = { listingSchema, reviewSchema };