import { User } from "../../../model/User.js";
import jwt from "jsonwebtoken";

describe("user.generateAuthToken", () => {
    it("should return valid JWT", () => {
        const user = new User({ roles: "admin" });
        const token = user.generateAuthToken();
        const decodedObject = jwt.verify(token, process.env.JWT_TOKEN);

        expect(decodedObject).toMatchObject({ roles: "admin" });
    });
});
