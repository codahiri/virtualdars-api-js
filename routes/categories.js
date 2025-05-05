import { Router } from "express";
import { Category, validateCategory } from "../model/Category.js";
import { auth } from "../middleware/auth.js";
import { roles } from "../middleware/roles.js";
import { catchAsync } from "../utils/catchAsync.js";
import mongoose from "mongoose";

const router = Router();

// post data
router.post(
    "/",
    auth,
    catchAsync(async (req, res) => {
        const { error } = validateCategory(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let category = {
            name: req.body.name,
        };

        const result = await Category.create(category);
        res.status(201).send(result);
    })
);

// get all data
router.get(
    "/",
    catchAsync(async (req, res, next) => {
        const categories = await Category.find().sort("name");
        res.send(categories);
    })
);

// get data by id
router.get(
    "/:id",
    catchAsync(async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(404).send("Yaroqsiz ID");

        let category = await Category.findById(req.params.id);
        if (!category)
            res.status(404).send("Berilgan ID lik kategoriya topilmadi");

        res.send(category);
    })
);

router.put(
    "/:id",
    catchAsync(auth, async (req, res) => {
        const { error } = validateCategory(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );

        if (!category) {
            return res.status(404).send("Berilgan ID lik kategoriya topilmadi");
        }

        res.send(category);
    })
);

// delete data by id
router.delete(
    "/:id",
    [auth, roles],
    catchAsync(async (req, res) => {
        let category = await Category.findByIdAndDelete(req.params.id);
        if (!category)
            res.status(404).send("Berilgan ID lik kategoriya topilmadi");

        res.send(category);
    })
);

export default router;
