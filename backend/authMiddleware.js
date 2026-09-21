import {supabase} from './subabaseClient.js';

export const verifyToken = async (req, res, next) => {
    //token wyjęty z nagłówka
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Brak tokenu autoryzacyjnego' });
    }
    //sprawdzenie tokenu czy jest poprawny dla tego usera
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return res.status(401).json({ message: 'Nieprawidłowy lub wygasły token' });
    }
    //token ? ok
    req.user = user;
    next();
};