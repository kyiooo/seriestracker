import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handlechange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const {error} = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (error){
                setError("Nieprawidłowy email lub hasło");
                return;
            }
            navigate("/");
        } catch(err){
            setError("Błąd logowania");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
            <div className="orb orb-three"></div>


            <div className="particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <section className="login-card">
                <div className="brand">
                    <div className="brand-icon">🎬</div>
                    <h1>SeriesTracker</h1>
                </div>
                <div className="card-header">
                    <h2>Zaloguj się</h2>
                    <p></p>
                </div>
                {location.state?.registered && (
                    <div className="login-success">
                        Konto zostało utworzone. Sprawdź skrzynkę email i aktywuj konto aby się zalogować.
                    </div>
                )}
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder=""
                            value={formData.email}
                            onChange={handlechange}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder=""
                            value={formData.password}
                            onChange={handlechange}
                            required
                        />
                        <label>Hasło</label>
                        <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <button className="main-btn" type="submit" disabled = {loading}>
                        <span>{loading ? "Logowanie ..." : "Zaloguj się"}</span>
                    </button>
                </form>
                <p className="switch-text">
                    Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                </p>
            </section>
        </main>
    );
}
export default LoginPage;