const Joi = require('joi');

const schema = Joi.object({
    type: Joi.string()
        .required(),
    name: Joi.string()
        .required(),
    phoneNumber: Joi.string()
        .length(12)
        .required(),
    customerName: Joi.string()
        .required(),
    mediaId: Joi.string()
});

module.exports = schema;