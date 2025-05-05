export const roles = (req, res, next) => {
    const method = req.method;
    const role = req.user.roles;

    if (role === 'admin') {
        return next(); // barcha huquqlar
    }

    if (role === 'moder') {
        if (['GET', 'POST', 'PUT', 'PATCH'].includes(method)) {
            return next();
        } else {
            return res.status(403).send("Access Denied for moder!");
        }
    }

    if (role === 'user') {
        if (method === 'GET') {
            return next();
        } else {
            return res.status(403).send("Access Denied for user!");
        }
    }

    // No valid role
    return res.status(403).send("Access Denied!");
};
