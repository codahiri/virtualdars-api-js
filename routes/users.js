import _ from "lodash";
import bcrypt from "bcrypt";
import { Router } from "express";
import { User, validateUser } from "../model/User.js";
import { auth } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

// POST user
router.post(
    "/",
    auth,
    catchAsync(async (req, res) => {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("Mavjud bo'lgan foydalanuvchi");

        user = new User(
            _.pick(req.body, ["name", "email", "password", "roles"]),
        );

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        res.status(201).send(_.pick(user, ["_id", "name", "email", "roles"]));
    }),
);

// GET user
router.get(
    "/me",
    auth,
    catchAsync(async (req, res) => {
        const users = await User.findById(req.user._id).select("-password");
        res.send(users);
    }),
);

export default router;
