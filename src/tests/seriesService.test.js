import axios from "axios";
import { supabase } from "../services/supabaseClient.js";
import {
    getTrending, getSeriesDetails, getSeasonDetails,
    addSeriesToList, getUserSeries, removeSeriesFromList, updateSeriesProgress, searchSeries
} from "../services/seriesService.js";

jest.mock("axios");
jest.mock("../services/supabaseClient.js", () => ({
    supabase: {
        auth: { getSession: jest.fn() }
    }
}));

describe("seriesService - Pełne pokrycie", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockSession = { access_token: "fake-token" };

    // TRENDY NA KARCIE
    test("getTrending sukces", async () => {
        axios.get.mockResolvedValueOnce({ data: [1, 2] });
        const res = await getTrending();
        expect(res).toEqual([1, 2]);
    });

    test("getTrending błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Network Error"));
        const res = await getTrending();
        expect(res).toEqual([]);
    });

    // POBIERANIE SZCZEGÓŁÓW SERIALU
    test("getSeriesDetails sukces", async () => {
        axios.get.mockResolvedValueOnce({ data: { id: 1, name: "Test" } });
        const res = await getSeriesDetails(1);
        expect(res.name).toBe("Test");
    });

    test("getSeriesDetails błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error"));
        const res = await getSeriesDetails(1);
        expect(res).toBeNull();
    });

    // POBIERANIE SZCZEGÓŁÓW SEZONU
    test("getSeasonDetails sukces", async () => {
        axios.get.mockResolvedValueOnce({ data: { episodes: [] } });
        const res = await getSeasonDetails(1, 1);
        expect(res.episodes).toBeDefined();
    });

    test("getSeasonDetails błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error"));
        const res = await getSeasonDetails(1, 1);
        expect(res).toBeNull();
    });

    // DODAWANIE SERIALU DO LISTY
    test("addSeriesToList sukces", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.post.mockResolvedValueOnce({ data: { message: "Dodano" } });

        const res = await addSeriesToList(1, "Planowane");
        expect(res.success).toBe(true);
        expect(res.message).toBe("Dodano");
    });

    test("addSeriesToList brak sesji", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });
        const res = await addSeriesToList(1);
        expect(res.success).toBe(false);
    });

    test("addSeriesToList błąd serwera", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.post.mockRejectedValueOnce({ response: { data: { message: "Duplikat" } } });

        const res = await addSeriesToList(1);
        expect(res.success).toBe(false);
        expect(res.message).toBe("Duplikat");
    });

    // POBIERANIE SERIALI UZYTKOWINKA
    test("getUserSeries sukces", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await getUserSeries();
        expect(res.length).toBe(1);
    });

    test("getUserSeries błąd", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.get.mockRejectedValueOnce(new Error("Error"));

        const res = await getUserSeries();
        expect(res).toEqual([]);
    });

    // USUWANIE SERIALU Z LISTY
    test("removeSeriesFromList sukces", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.delete.mockResolvedValueOnce({});

        const res = await removeSeriesFromList(1);
        expect(res.success).toBe(true);
    });

    test("removeSeriesFromList błąd", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.delete.mockRejectedValueOnce(new Error("Error"));

        const res = await removeSeriesFromList(1);
        expect(res.success).toBe(false);
    });

    // UPDATE PROGRESS
    test("updateSeriesProgress sukces", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.patch.mockResolvedValueOnce({ data: { updated: true } });

        const res = await updateSeriesProgress(1, { episodes_watched: 5 });
        expect(res.success).toBe(true);
    });

    test("updateSeriesProgress błąd", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.patch.mockRejectedValueOnce(new Error("Error"));

        const res = await updateSeriesProgress(1, {});
        expect(res.success).toBe(false);
    });

    // WYSZUKIWANIE SERIALI
    test("searchSeries sukces", async () => {
        axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: "Batman" }] });
        const res = await searchSeries("batman");
        expect(res.length).toBe(1);
        expect(res[0].name).toBe("Batman");
    });

    test("searchSeries błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error"));
        const res = await searchSeries("batman");
        expect(res).toEqual([]);
    });
});