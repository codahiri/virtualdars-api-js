import { Router } from 'express';
import RSS from 'rss';
import { Category } from '../model/Category.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/', catchAsync(async (req, res) => {
    const feed = new RSS({
        title: 'Mening Saytim Kategoriyalari',
        description: 'Saytdagi barcha kategoriyalar ro‘yxati',
        feed_url: 'http://localhost:8000/rss',
        site_url: 'http://localhost:8000',
        language: 'uz',
    });

    const categories = await Category.find().sort({ name: 1 });

    categories.forEach((category) => {
        feed.item({
            title: category.name,
            description: `Kategoriya nomi: ${category.name}`,
            url: `http://localhost:8000/api/categories/${category._id}`,
            date: category.createdAt,
        });
    });

    const xml = feed.xml({ indent: true });
    res.type('application/xml');
    res.send(xml);
}));

export default router;
