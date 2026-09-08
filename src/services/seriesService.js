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