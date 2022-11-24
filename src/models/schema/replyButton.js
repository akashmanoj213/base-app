const Joi = require('joi');

const schema = Joi.object({
    type: Joi.string()
        .required(),
    subType: Joi.string()
        .required(),
    phoneNumber: Joi.string()
        .length(12)
        .required(),
    body: Joi.string()
        .required(),
    buttons: Joi.array().items(Joi.string().required()),
    header: Joi.string(),
    footer: Joi.string()
});

module.exports = schema;