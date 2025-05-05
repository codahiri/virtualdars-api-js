import { Schema, model } from 'mongoose';
import Joi from 'joi';

const customerSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isVip: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    bonusPouint: {
        type: Number,
        default: 0
    }
})

export const Customer = model("Customer", customerSchema);

// helper functions
export function validateCustomer(data) {
    const customerSchema = Joi.object({
        name: Joi.string().required().min(3).max(20),
        isVip: Joi.boolean().required(),
        phone: Joi.string().required().min(5).max(20),
        bonusPouint: Joi.number()
    })

    return customerSchema.validate(data);
}

export function validatePartialCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50),
        isVip: Joi.boolean(),
        phone: Joi.string().min(5).max(50),
        bonusPouint: Joi.number()
    });
    return schema.validate(customer);
}
