import _ from "lodash";
import { Router } from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import { User } from "../model/User.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

// POST user
router.post(
  "/",
  catchAsync(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email yoki password xato!");

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword)
      return res.status(400).send("Email yoki password xato!");

    const token = user.generateAuthToken();
    res.header("x-Auth-Token", token).send(true);
  })
);

function validate(req) {
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
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(complexityOptions),
  });

  return schema.validate(req);
}

export default router;
