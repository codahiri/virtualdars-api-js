import { Router } from 'express';
import { Course, validateCourse } from '../model/Course.js'
import { Category } from '../model/Category.js';
import { catchAsync } from '../utils/catchAsync.js'

const router = Router();

// post data
router.post('/', catchAsync(async (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cat = await Category.findById(req.body.category);
    if (!cat) return res.status(404).send("Berilgan ID lik kategoriya topilmadi");

    const course = await Course.create({ ...req.body });
    res.status(201).send(course);
}))

// get all data
router.get('/', catchAsync(async (req, res) => {
    const courses = await Course.find()
        .populate('category', 'name')
        .sort('title');
    res.send(courses);
}))

// get data by id
router.get('/:id', catchAsync(async (req, res) => {
    let course = await Course.findById(req.params.id);
    if (!course) res.status(404).send("Berilgan ID lik kurs topilmadi");

    res.send(course);
}))

// update
router.put('/:id', catchAsync(async (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = await Course.findByIdAndUpdate(
        req.params.id,
        { title: req.body.title },
        { new: true }
    );

    if (!course) {
        return res.status(404).send("Berilgan ID lik kurs topilmadi");
    }

    res.send(course);
}));

// PATCH /api/courses/:id
router.patch('/:id', catchAsync(async (req, res) => {
    // 1) Kelgan maydon(lar)ni aniqlaymiz
    const updates = Object.keys(req.body);
    if (updates.length === 0) {
        return res.status(400).send("Yangilash uchun kamida bitta maydon yuboring");
    }

    // 2) Ijozat berilgan maydonlar ro'yxati (agar kerak bo'lsa)
    const allowed = ['title', 'tags', 'trainer', 'status', 'category'];
    const isValid = updates.every(key => allowed.includes(key));
    if (!isValid) {
        return res.status(400).send("Siz faqat quyidagi maydonlarni yangilashingiz mumkin: " + allowed.join(', '));
    }

    // Agar category yangilanayotgan bo'lsa, sub‑doc’ga aylantiramiz:
    const updateObj = { ...req.body };
    if (req.body.category) {
        // body.category da yangi categoryId bo'lishi kutiladi
        const newCat = await Category.findById(req.body.category);
        if (!newCat)
            return res.status(404).send("Berilgan ID lik kategoriya topilmadi");
        updateObj.category = {
            _id: newCat._id,
            name: newCat.name
        };
    }

    // 3) Yangilash
    const course = await Course.findByIdAndUpdate(
        req.params.id,
        // req.body ichidagi barcha maydonlar avtomatik $set qilinadi
        req.body,
        updateObj,
        {
            new: true,         // yangilangan hujjatni qaytar
            runValidators: true // Mongoose schema validatsiyasini ishga tushir
        }
    );

    if (!course) {
        return res.status(404).send("Berilgan ID lik kurs topilmadi");
    }

    res.send(course);
}));

// delete data by id
router.delete('/:id', catchAsync(async (req, res) => {
    let course = await Course.findByIdAndDelete(req.params.id);
    if (!course) res.status(404).send("Berilgan ID lik kurs topilmadi");

    res.send(course);

}))

export default router;