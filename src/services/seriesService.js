import axios from "axios"

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