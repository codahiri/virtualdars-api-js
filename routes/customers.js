import { Router } from 'express';
import { Customer, validateCustomer, validatePartialCustomer } from '../model/Customer.js';
import { catchAsync } from '../utils/catchAsync.js'

const router = Router();

// post data
router.post('/', catchAsync(async (req, res) => {
    // xaolikni tekshirish
    const { error } = validateCustomer(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isVip: req.body.isVip,
        phone: req.body.phone
    })

    const result = await customer.save();
    res.status(201).send(result);

}))

// get all data
router.get('/', catchAsync(async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
}))

// get data by id
router.get('/:id', catchAsync(async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    if (!customer) res.status(404).send("Berilgan ID lik kategoriya topilmadi");

    res.send(customer);
}))

// update data by id
router.put('/:id', catchAsync(async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            isVip: req.body.isVip,
            phone: req.body.name,
        },
        { new: true }
    );

    if (!customer) {
        return res.status(404).send("Berilgan ID lik kategoriya topilmadi");
    }

    res.send(customer);
}));

// update data with patch
router.patch('/:id', catchAsync(async (req, res) => {
    const { error } = validatePartialCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return res.status(404).send("Berilgan ID lik mijoz topilmadi");
    }

    // Faqat yuborilgan qiymatlarni yangilaymiz
    if (req.body.name) customer.name = req.body.name;
    if (req.body.isVip !== undefined) customer.isVip = req.body.isVip;
    if (req.body.phone) customer.phone = req.body.phone;

    const result = await customer.save();
    res.send(result);

}));


// delete data by id
router.delete('/:id', catchAsync(async (req, res) => {
    let customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) res.status(404).send("Berilgan ID lik kategoriya topilmadi");

    res.send(customer);

}))

export default router;