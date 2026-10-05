import request from "supertest";
import axios from "axios";
import { supabase } from "./subabaseClient.js";
import app from "./server.js";

jest.mock("./authMiddleware.js", () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: "test-user-id" };
        next();
    }
}));

jest.mock("axios");
jest.mock("./subabaseClient.js", () => {
    const chainable = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
    };
    return { supabase: chainable };
});


describe("Express Server - Pełne Pokrycie", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // PUBLICZNE ENDPOINTY
    test("GET /api/series/:id", async () => {
        axios.get.mockResolvedValueOnce({ data: { name: "Test" } });
        const res = await request(app).get("/api/series/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Test");
    });

    test("GET /api/series/:id błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error"));
        const res = await request(app).get("/api/series/1");
        expect(res.statusCode).toBe(500);
    });

    test("GET /api/series/:id/season/:seasonNumber", async () => {
        axios.get.mockResolvedValueOnce({ data: { episodes: [] } });
        const res = await request(app).get("/api/series/1/season/1");
        expect(res.statusCode).toBe(200);
    });

    // CHRONIONE ENDPOINTY

    test("POST /api/user-series sukces", async () => {
        supabase.insert.mockResolvedValueOnce({ data: null, error: null });
        const res = await request(app).post("/api/user-series").send({ seriesId: 1 });
        expect(res.statusCode).toBe(201);
    });

    test("POST /api/user-series błąd duplikatu", async () => {
        supabase.insert.mockResolvedValueOnce({ data: null, error: { code: '23505' } });
        const res = await request(app).post("/api/user-series").send({ seriesId: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("już znajduje się");
    });

    test("GET /api/user-series sukces z detalami z TMDb", async () => {
        // BAZA DANYCH
        supabase.order.mockResolvedValueOnce({
            data: [{ series_id: 1, status: "Planowane" }],
            error: null
        });
        // ODPOWIEDZ Z API
        axios.get.mockResolvedValueOnce({ data: { name: "Serial z bazy" } });

        const res = await request(app).get("/api/user-series");
        expect(res.statusCode).toBe(200);
        expect(res.body[0].details.name).toBe("Serial z bazy");
    });

    test("DELETE /api/user-series/:seriesId", async () => {
        // Pierwsze wywołanie zwraca ten sam obiekt drugie zwraca brak błędu po sukcesie
        supabase.eq
            .mockReturnValueOnce(supabase)
            .mockResolvedValueOnce({ error: null });

        const res = await request(app).delete("/api/user-series/1");
        expect(res.statusCode).toBe(200);
    });

    test("PATCH /api/user-series/:seriesId", async () => {
        supabase.select.mockResolvedValueOnce({ data: [{ id: 1 }], error: null });
        const res = await request(app)
            .patch("/api/user-series/1")
            .send({ status: "W trakcie", episodes_watched: 5 });
        expect(res.statusCode).toBe(200);
    });
    test("GET /api/search sukces", async () => {
        axios.get.mockResolvedValueOnce({ data: { results: [{ id: 1, name: "Batman" }] } });
        const res = await request(app).get("/api/search?query=batman");
        expect(res.statusCode).toBe(200);
        expect(res.body[0].name).toBe("Batman");
    });

    test("GET /api/search błąd - brak frazy", async () => {
        const res = await request(app).get("/api/search");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Brak frazy wyszukiwania");
    });
});