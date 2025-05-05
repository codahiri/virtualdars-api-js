import { Schema, model } from "mongoose";
import Joi from "joi";

export const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
});

export const Category = model("Category", categorySchema);

// helper functions
export function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
    });

    return schema.validate(category);
}
