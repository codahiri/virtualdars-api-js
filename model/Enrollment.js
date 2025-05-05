import { Schema, model } from 'mongoose';
import Joi from 'joi';

const enrollmentSchema = Schema({
    courseFee: {
        type: Number,
        min: 0,
    },
    dateStart: {
        type: Date,
        default: Date.now
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }
})

export const Enrollment = model("Enrollment", enrollmentSchema);

// helper functions
export function validateEnrollment(enrollment) {
    const schema = Joi.object({
        courseFee: Joi.number(),
        dateStart: Joi.date(),
        customer: Joi.string().hex().length(24).required(),
        course: Joi.string().hex().length(24).required()
    })

    return schema.validate(enrollment);
}
