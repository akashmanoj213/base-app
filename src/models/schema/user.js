const Joi = require('joi');

const schema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .required(),
    lastName: Joi.string()
        .min(1)
        .required(),
    email: Joi.string().email(),
    phoneNumber: Joi.string()
        .length(10)
        .pattern(/^\d+$/)
        .required(),
    DOB: Joi.date().less('12-31-2017'),
    gender: Joi.string(),
    height: Joi.number(),
    weight: Joi.number(),
    isHavingPED: Joi.boolean(),
    isHavingFamilyHistory: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
    isPhoneVerified: Joi.boolean(),
    isUserVerified: Joi.boolean()
});

module.exports = schema;