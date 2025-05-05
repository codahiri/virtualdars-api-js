import request from "supertest";
import { Category } from "../../model/Category.js";
import { User } from "../../model/User.js";
import mongoose from "mongoose";

let server;

describe("/api/categories", () => {
    beforeEach(async () => {
        const mod = await import("../../index.js");
        server = mod.server;
    });
    afterEach(async () => {
        await new Promise((resolve) => server.close(resolve));
        await Category.deleteMany({});
    });

    describe("GET /", () => {
        it("should return all categories", async () => {
            await Category.collection.insertMany([
                { name: "Test 1" },
                { name: "Test 2" },
                { name: "Test 3" },
            ]);
            const res = await request(server).get("/api/categories");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some((cat) => cat.name === "Test 1")).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should return a category if valid id is given", async () => {
            const category = new Category({ name: "ai-app" });
            await category.save();

            const res = await request(server).get(
                "/api/categories/" + category._id
            );

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "ai-app");
        });

        it("should return 404 if invalid id is given", async () => {
            const res = await request(server).get("/api/categories/123");

            expect(res.status).toBe(404);
        });

        it("should return 404 if category is invalid", async () => {
            const categoryId = new mongoose.Types.ObjectId();

            const res = await request(server).get(
                "/api/categories/" + categoryId
            );
            expect(res.status).toBe(404);
        });
    });

    describe("POST", () => {
        let token;
        let name;

        const execute = async () => {
            return await request(server)
                .post("/api/categories")
                .set("x-Auth-Token", token)
                .send({ name });
        };

        beforeEach(() => {
            const user = new User();
            token = user.generateAuthToken();
            // token = new User.generateAuthToken();
            name = "dasturlash";
        });

        it("should return 401 if user is not logged in", async () => {
            token = "";
            const res = await execute();
            expect(res.status).toBe(401);
        });

        it("should return 201 if category name is less than 3 characters", async () => {
            // name = "12";
            const res = await execute();
            expect(res.status).toBe(201);
        });

        it("should return 400 if category name is more than 50 characters", async () => {
            name = new Array(52).join("c");
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it("should save the category if it is valid", async () => {
            await execute();
            const category = await Category.find({ name: "dasturlash" });
            expect(category).not.toBeNull();
        });

        it("should return the category if it is valid", async () => {
            const res = await execute();
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "dasturlash");
        });
    });
});
