import express from 'express'
import cors from 'cors'
import axios from 'axios'
import * as dotenv from "dotenv";
import { supabase } from './subabaseClient.js';
import { verifyToken } from './authMiddleware.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SERWER DZIAŁA GICIO!' });
});

//pobieranie trendujących seriali na karuzelę -- strona główna
app.get('/api/trending', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/tv/week?language=pl-PL`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB}`
            }
        });
        res.json(response.data.results);
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Błąd pobierania z TMDb'});
    }
});

//pobieranie sezonów seriali
app.get('/api/series/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?language=pl-PL`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB}`
            }
        });
        res.json(response.data);
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Błąd pobierania szegłówów seriali z TMDb'});
    }
});

//pobieranie odcinków seriali
app.get('/api/series/:id/season/:seasonNumber', async (req, res) => {
    try {
        const { id, seasonNumber } = req.params;
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=pl-PL`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd pobierania odcinków z TMDb' });
    }
});
//Dodawanie serialu do listy dla zalogowanego użytkownika
app.post('/api/user-series', verifyToken, async (req, res) => {
    try{
        const userId = req.user.id;
        //id serialu pobrane z clienta na froncie
        const{ seriesId, status} = req.body;

        const { data, error } = await supabase .from('user_series').insert({
            user_id: userId,
            series_id: seriesId,
            status: status || "Planowane"
        })
        if(error){
            if(error.code === '23505'){
                return res.status(400).json({message:"Ten serial już znajjduje się na twjej liście"});
            }
            throw error;
        }
            res.status(201).json({message:"Serial pomyłśnie dodany do listy"});
    }catch(error){
        console.error(error,"Bałąd zapisu");
        res.status(500).json({message:"Bład serwera przy dodawaniu serialu"})
    }
})

//Wyświetlanie listy seriali zalogowanego użytkownika
app.get('/api/user-series', verifyToken ,async (req, res) => {
    try{
        const userId = req.user.id;
        const {data: userSeries, error} = await supabase .from('user_series')
            .select('*')
            .eq('user_id', userId)
            .order('created_at');
        if(error) throw error;

        const seriesWithDetails = await Promise.all(
            userSeries.map(async (item) => {
                try{
                    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${item.series_id}?language=pl-PL`,{
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB}`
                }
                    });
                    return {
                        ...item,
                        details: tmdbResponse.data
                    };
                }catch(error){
                    console.error(error,`Błąd Pobierania TMDB DLA SERIALU ID: ${item.series_id}`);
                    return item;
                }
            })
        )
        res.json(seriesWithDetails);
    }catch(error){
        console.error(error, `Błąd pobierania listy`);
        res.status(500).json({message: "Błąd serwera przy pobieraniu serialu"});
    }
})

//Usuwanie serialu z listy
app.delete('/api/user-series/:seriesId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const seriesId = req.params.seriesId;

        const { error } = await supabase
            .from('user_series')
            .delete()
            .eq('user_id', userId)
            .eq('series_id', seriesId);

        if (error) throw error;

        res.status(200).json({ message: "Serial usunięty z listy." });
    } catch (error) {
        console.error("Błąd usuwania:", error);
        res.status(500).json({ message: "Błąd serwera przy usuwaniu serialu." });
    }
});
//Zmiana statusu serialu dodanego do listy - standardowo dodany jako Planowane
app.patch('/api/user-series/:seriesId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const seriesId = req.params.seriesId;
        const { status, episodes_watched, user_rating } = req.body;

        const { data, error } = await supabase
            .from('user_series')
            .update({
                ...(status && { status }),
                ...(episodes_watched !== undefined && { episodes_watched }),
                ...(user_rating !== undefined && { user_rating })
            })
            .eq('user_id', userId)
            .eq('series_id', seriesId)
            .select();

        if (error) throw error;

        res.status(200).json({ message: "Zaktualizowano pomyślnie.", data });
    } catch (error) {
        console.error("Błąd aktualizacji:", error);
        res.status(500).json({ message: "Błąd serwera przy aktualizacji." });
    }
});


app.listen(PORT, () => {
    console.log(`Serwer działa na porcie http://localhost:${PORT}/api/health`);
});