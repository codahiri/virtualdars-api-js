import helmet from "helmet";
import compression from "compression";

export default function setupProd(app) {
    app.use(helmet());
    app.use(compression());
}
