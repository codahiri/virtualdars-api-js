import winston from "winston";

export const errorMiddleware = (err, req, res, next) => {
    winston.error(err.message, err);
    res.status(500).send("Serverda xatolik yuz berdi");
};
