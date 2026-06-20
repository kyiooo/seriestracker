import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";
import { supabase } from "../services/supabaseClient";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateUsername = (username) => {
        const lowerUsername = username.toLowerCase();
        return lowerUsername.length >= 5 && lowerUsername.length <= 20 && /^[a-z0-9]+$/.test(lowerUsername);
    };

    const validatePassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleChange = (e) => {
        setError("");
        setSuccess("");
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateUsername(formData.username)) {
            setError("Nazwa użytkownika musi mieć od 5 do 20 znaków i może zawierać tylko małe litery i cyfry.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setError("Nieprawidłowy format adresu email.");
            return;
        }

        if (!validatePassword(formData.password)) {
            setError("Hasło musi mieć co najmniej 8 znaków, zawierać małą literę, wielką literę, cyfrę i znak specjalny.");
            return;
        }

        if (formData.password !== formData.repeatPassword) {
            setError("Hasła muszą być takie same.");
            return;
        }
        try {
            setLoading(true);
            const {error} = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        username: formData.username,
                    },
                },
            });
            if (error) {
                setError(error.message);
                return;
            }
            setSuccess("Konto utworzone. Możesz się zalogować.");
            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
            setError("Brak połączenia z serwerem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <div className="register-orb register-orb-one"></div>
            <div className="register-orb register-orb-two"></div>
            <div className="register-orb register-orb-three"></div>

            <div className="register-particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <section className="register-card">
                <div className="register-brand">
                    <div className="register-icon">🎬</div>
                    <h1>SeriesTracker</h1>
                </div>
                <div className="register-header">
                    <h2>Zarejestruj się</h2>
                    <p></p>
                </div>
                {error && <div className="register-error">{error}</div>} 
                {success && <div className="register-success">{success}</div>}
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-input-box">
                        <input
                            type="text"
                            name="username"
                            placeholder=""
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label>Nazwa użytkownika</label>
                    </div>
                    <div className="register-input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder=""
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className="register-input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder=""
                            value={formData.password}
                            onChange={handleChange}
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
                    <div className="register-input-box">
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            name="repeatPassword"
                            placeholder=""
                            value={formData.repeatPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>Powtórz hasło</label>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        >
                            {showRepeatPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <button className="register-btn" type="submit" disabled={
                        loading
                    }>
                        <span>{loading ? "Tworzenie konta ..." : "Zarejestruj się"}</span>
                    </button>
                </form>
                <p className="register-switch">
                    Masz już konto? <Link to="/login">Zaloguj się</Link>
                </p>
            </section>
        </main>
    );
}
export default RegisterPage;