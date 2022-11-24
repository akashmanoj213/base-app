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
    button: Joi.string()
        .required(),
    categories: Joi.array()
        .items(Joi.object({
            title: Joi.string()
                .min(1)
                .required(),
            options: Joi.array()
                .items(Joi.object({
                    title: Joi.string()
                        .required(),
                    description: Joi.string()
                        .required()
                }))
        })),
    header: Joi.string(),
    footer: Joi.string()
});

module.exports = schema;