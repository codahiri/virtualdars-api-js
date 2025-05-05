import { connect } from "mongoose";
import winston from "winston";

export const db = async () => {
    try {
        // // mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mycluster.cbm1vlz.mongodb.net/virtualdars
        await connect(process.env.MONGO_URI);
        winston.debug("MongoDB ga ulanish hosil qilindi!");
    } catch (err) {
        winston.error("Ulanishda xatolik yuz berdi ", err);
    }
};
