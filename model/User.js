import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const userSchema = Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024,
        required: true,
    },
    roles: {
        type: String,
        enum: ['admin', 'moder', 'user'],
        default: 'user'
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, roles: this.roles }, process.env.JWT_TOKEN);
    return token;
}

export const User = model("User", userSchema);

// helper functions
export function validateUser(user) {
    const complexityOptions = {
        min: 5,
        max: 255,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    };
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity(complexityOptions),
        roles: Joi.string()
    })

    return schema.validate(user);
}
