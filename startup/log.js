import winston from "winston";
await import("winston-mongodb");

// logs funksiyasini avtomatik chaqirish
(() => {
    winston.add(
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            level: "error",
            collection: "logs",
        }),
    );
    winston.add(
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    );
    winston.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            level: "info",
        }),
    );
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    );

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });
})();
