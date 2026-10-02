import axios from "axios"
import { supabase } from "./supabaseClient";
const API_URL = 'http://localhost:3000/api';

export const getTrending = async () =>{
    try {
        const response = await axios.get(`${API_URL}/trending`);
        return response.data;
    }catch(error){
        console.error("Błąd połączenia z api trendy",error)
        return []
    }
};

export const getSeriesDetails = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/series/${id}`);
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania szczegółów SERIALU", error);
        return null;
    }
};

export const getSeasonDetails = async (id, seasonNumber) => {
    try {
        const response = await axios.get(`${API_URL}/series/${id}/season/${seasonNumber}`);
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania odcinków", error);
        return null;
    }
};

export const addSeriesToList = async (seriesId, status = 'Planowane') => {
    try {
        //pobieranie aktualnej sesji z supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return { success: false, message: "Musisz być zalogowany, aby dodać serial." };
        }

        const token = session.access_token;

        //endpoint z tokenem do weryfikacji
        const response = await axios.post(`${API_URL}/user-series`, {
            seriesId: seriesId,
            status: status
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return { success: true, message: response.data.message };
    } catch (error) {
        console.error("Błąd dodawania do listy:", error);
        //komunikat błędu zaciągnięty z expresa
        const errorMessage = error.response?.data?.message || "Wystąpił błąd przy zapisie.";
        return { success: false, message: errorMessage };
    }
};
export const getUserSeries = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) return [];

        const response = await axios.get(`${API_URL}/user-series`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania listy:", error);
        return [];
    }
};
export const removeSeriesFromList = async (seriesId) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) return { success: false };

        await axios.delete(`${API_URL}/user-series/${seriesId}`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
        });
        return { success: true };
    } catch (error) {
        console.error("Błąd usuwania:", error);
        return { success: false };
    }
};

export const updateSeriesProgress = async (seriesId, updates) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) return { success: false };

        const response = await axios.patch(`${API_URL}/user-series/${seriesId}`, updates, {
            headers: { Authorization: `Bearer ${session.access_token}` }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Błąd aktualizacji:", error);
        return { success: false };
    }
};

