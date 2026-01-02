const Joi = require('joi');

const productSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
    categories: Joi.alternatives().try(
        Joi.array().items(Joi.number().integer()),
        Joi.string(),
        Joi.number().integer()
    ).optional(),
    tags: Joi.string().max(255).optional(),
    location_name: Joi.string().optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    shop_id: Joi.number().integer().optional(),
    image_url: Joi.string().optional() // For update
});

const orderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            id: Joi.number().integer().required(),
            price: Joi.number().min(0).optional() // Price is verified on server, but okay to receive
        })
    ).min(1).required()
});

module.exports = {
    productSchema,
    orderSchema
};
