import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
    const [fromData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const handlechange = (e) => {
        setFormData({
            ...fromData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Logowanie:", fromData);
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

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder=""
                            value={fromData.email}
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
                            value={fromData.password}
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
                    <button className="main-btn" type="submit">
                        <span>Zaloguj się</span>
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