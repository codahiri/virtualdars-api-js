import { Router } from 'express';
import mongoose from 'mongoose';
import { Enrollment, validateEnrollment } from '../model/Enrollment.js';
import { Customer } from '../model/Customer.js'
import { Course } from '../model/Course.js'
import { catchAsync } from '../utils/catchAsync.js'

const router = Router();

// post data
router.post('/', catchAsync(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { error } = validateEnrollment(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        if (!mongoose.Types.ObjectId.isValid(req.body.customer))
            return res.status(400).send("Noto'g'ri customer ID");
        const customer = await Customer.findById(req.body.customer).session(session);
        if (!customer)
            return res.status(404).send("Berilgan ID lik mijoz topilmadi");

        if (!mongoose.Types.ObjectId.isValid(req.body.course))
            return res.status(400).send("Noto'g'ri course ID");
        const course = await Course.findById(req.body.course).session(session);
        if (!course)
            return res.status(404).send("Berilgan ID lik kurs topilmadi");

        const enrollment = new Enrollment({ ...req.body });
        if (customer.isVip)
            enrollment.courseFee = course.fee - (0.2 * course.fee);
        await enrollment.save({ session });

        customer.bonusPouint++;
        await customer.save({ session });

        await session.commitTransaction(); // barcha saqlash muvaffaqiyatli bo‘lsa
        session.endSession();

        res.status(201).send(enrollment);
    } catch (err) {
        await session.abortTransaction(); // xatolik bo‘lsa orqaga qaytariladi (rollback)
        session.endSession();
        throw err;
    }
}))

// get all data
router.get('/', catchAsync(async (req, res) => {
    const enrollments = await Enrollment.find()
        .populate('course', 'title')
        .populate('customer', 'name')
        .sort('dateStart');
    res.send(enrollments);
}))

// get data by id
router.get('/:id', catchAsync(async (req, res) => {
    let enrollment = await Enrollment.findById(req.params.id)
        .populate('course', 'title')
        .populate('customer', 'name')
    if (!enrollment) res.status(404).send("Berilgan ID lik kurs topilmadi");

    res.send(enrollment);
}))

// update
router.put('/:id', catchAsync(async (req, res) => {
    const { error } = validateEnrollment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const enrollment = await Enrollment.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
    );

    if (!enrollment) {
        return res.status(404).send("Berilgan ID lik kurs topilmadi");
    }

    res.send(enrollment);
}));

// PATCH /api/courses/:id
router.patch('/:id', catchAsync(async (req, res) => {
    // 1) Kelgan maydon(lar)ni aniqlaymiz
    const updates = Object.keys(req.body);
    if (updates.length === 0) {
        return res.status(400).send("Yangilash uchun kamida bitta maydon yuboring");
    }

    // 2) Ijozat berilgan maydonlar ro'yxati (agar kerak bo'lsa)
    const allowed = ['courseFee', 'dateStart', 'customer', 'course'];
    const isValid = updates.every(key => allowed.includes(key));
    if (!isValid) {
        return res.status(400).send("Siz faqat quyidagi maydonlarni yangilashingiz mumkin: " + allowed.join(', '));
    }

    // Agar customer yangilanayotgan bo'lsa, sub‑doc’ga aylantiramiz:
    const updateObj = { ...req.body };
    if (req.body.customer) {
        // body.customer da yangi customerId bo'lishi kutiladi
        const newCus = await Customer.findById(req.body.customer);
        if (!newCus)
            return res.status(404).send("Berilgan ID lik kategoriya topilmadi");
        updateObj.customer = {
            _id: newCus._id,
        };
    }
    if (req.body.course) {
        // body.course da yangi courseId bo'lishi kutiladi
        const newCurse = await Course.findById(req.body.course);
        if (!newCurse)
            return res.status(404).send("Berilgan ID lik kategoriya topilmadi");
        updateObj.course = {
            _id: newCurse._id,
        };
    }

    // 3) Yangilash
    const enrollment = await Enrollment.findByIdAndUpdate(
        req.params.id,
        // req.body ichidagi barcha maydonlar avtomatik $set qilinadi
        req.body,
        updateObj,
        {
            new: true,         // yangilangan hujjatni qaytar
            runValidators: true // Mongoose schema validatsiyasini ishga tushir
        }
    );

    if (!enrollment) {
        return res.status(404).send("Berilgan ID lik kurs topilmadi");
    }

    res.send(enrollment);
}));

// delete data by id
router.delete('/:id', catchAsync(async (req, res) => {
    let enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) res.status(404).send("Berilgan ID lik kurs topilmadi");

    res.send(enrollment);

}))

export default router;