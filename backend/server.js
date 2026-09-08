import express from 'express'
import cors from 'cors'
import axios from 'axios'
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SERWER DZIAŁA!' });
});

app.get('/api/trending', async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/trending/tv/week?language=pl-PL', {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB}`
            }
        });
        res.json(response.data.results);
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Błąd pobierania z TMDb'});
        return [];
    }
});
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie http://localhost:${PORT}/api/health`);
});