// validators/authValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    student_id: Joi.string().min(5).max(15).required(),
    phone: Joi.string().min(10).max(15).required(),
    dept: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    student_id: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};
