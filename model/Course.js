import { Schema, model } from 'mongoose';
import Joi from 'joi';

const courseSchema = Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    tags: {
        type: [String],
    },
    trainer: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true
    },
    fee: {
        type: Number,
        default: 100
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }
})

export const Course = model("Course", courseSchema);

// helper functions
export function validateCourse(course) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        tags: Joi.array().items(Joi.string()),
        trainer: Joi.string().required(),
        status: Joi.string().required(),
        category: Joi.string().hex().length(24).required()
    })

    return schema.validate(course);
}
