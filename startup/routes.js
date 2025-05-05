import { json } from "express";
import { errorMiddleware } from "../middleware/error.js";
import rss from "../routes/rss.js";
import home from "../routes/home.js";
import authRoute from "../routes/auth.js";
import categoryRoute from "../routes/categories.js";
import customerRoute from "../routes/customers.js";
import courseRoute from "../routes/courses.js";
import enrollmentRoute from "../routes/enrollments.js";
import usersRoute from "../routes/users.js";

export const routes = (app) => {
    // middleware
    app.use(json());

    // routes
    app.use("/", home);
    app.use("/rss", rss);
    app.use("/api/categories", categoryRoute);
    app.use("/api/customers", customerRoute);
    app.use("/api/courses", courseRoute);
    app.use("/api/enrollments", enrollmentRoute);
    app.use("/api/users", usersRoute);
    app.use("/api/auth", authRoute);
    app.use(errorMiddleware);
};
