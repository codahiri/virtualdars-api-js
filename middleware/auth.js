import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token = req.header('x-Auth-Token');
    if (!token)
        return res.status(401).send("To'ken yo'qligi sababli murojaat rad etildi!");

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send("Yaroqsiz token ", error);
    }
}