import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('index', { title: "Hey", message: "Hello there!" });
})

export default router;