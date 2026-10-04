import request from "supertest";
import { supabase } from "./subabaseClient.js";
import app from "./server.js";

jest.mock("./authMiddleware.js", () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: "6f9b63f9-a304-4ed0-ba78-04b7e3acd326" };
        next();
    }
}));

// Czas 10 sekund na zapytanie HTTP
jest.setTimeout(10000);

describe("Testy Integracyjne: Express <-> Supabase", () => {
    const testSeriesId = 999999;

    // Czyszczenie po testeach
    afterAll(async () => {
        await supabase
            .from("user_series")
            .delete()
            .eq("user_id", "6f9b63f9-a304-4ed0-ba78-04b7e3acd326");
    });

    test("1. POST /api/user-series - zapis dodanego serialu", async () => {
        const res = await request(app)
            .post("/api/user-series")
            .send({ seriesId: testSeriesId, status: "Planowane" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Serial pomyłśnie dodany do listy");
    });

    test("2. POST /api/user-series - blokowanie duplikatu", async () => {
        const res = await request(app)
            .post("/api/user-series")
            .send({ seriesId: testSeriesId });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Ten serial już znajjduje się na twjej liście");
    });

    test("3. DELETE /api/user-series/:seriesId - fizyczne usunięcie", async () => {
        const res = await request(app).delete(`/api/user-series/${testSeriesId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Serial usunięty z listy.");
    });
});