import { useState, useEffect } from "react";
import { useParams, Link} from "react-router-dom";
import {
    getSeriesDetails,
    getSeasonDetails,
    getUserSeries,
    updateSeriesProgress,
    removeSeriesFromList,
    addSeriesToList
} from "../services/seriesService";
import "../styles/SeriesDetailsPage.css";

export default function SeriesDetailsPage() {
    const { id } = useParams();

    const [series, setSeries] = useState(null);
    const [activeSeason, setActiveSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);

    // Stany do obsługi postępu użytkownika i dodawania
    const [userProgress, setUserProgress] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState("");

    const handleRemoveSeries = async () => {
        const result = await removeSeriesFromList(id);
        if (result.success) {
            setUserProgress(null); // Przełącza widok na przycisk dodawania
        }
    };

    const handleAddSeries = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        setFeedbackMsg("");

        const result = await addSeriesToList(Number(id), "Planowane");

        if (result.success) {
            const mySeriesList = await getUserSeries();
            const progress = mySeriesList.find((s) => s.series_id === Number(id));
            if (progress) {
                setUserProgress(progress);
            }
            setFeedbackMsg("Dodano do listy!");
        } else {
            setFeedbackMsg(result.message || "Błąd dodawania");
        }

        setIsUpdating(false);
        setTimeout(() => setFeedbackMsg(""), 3000);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            // 1. Pobieramy detale z TMDb
            const data = await getSeriesDetails(id);
            if (data && data.seasons) {
                // Pozbywamy się sezonu 0 (odcinki specjalne)
                data.seasons = data.seasons.filter(s => s.season_number > 0);
            }
            setSeries(data);

            // 2. Pobieramy listę usera i szukamy tego konkretnego serialu
            const mySeriesList = await getUserSeries();
            const progress = mySeriesList.find((s) => s.series_id === Number(id));
            if (progress) {
                setUserProgress(progress);
            }
        };

        fetchDetails();
    }, [id]);

    const handleSeasonClick = async (seasonNumber) => {
        if (activeSeason === seasonNumber) {
            setActiveSeason(null);
            setEpisodes([]);
            return;
        }

        setActiveSeason(seasonNumber);
        setEpisodes([]);

        const data = await getSeasonDetails(id, seasonNumber);

        if (data && data.episodes) {
            setEpisodes(data.episodes);
        }
    };

    // Oblicza globalny numer odcinka w skali całego serialu
    const calculateAbsoluteEpisodeNumber = (seasonNumber, episodeNumberInSeason) => {
        let absoluteCount = 0;
        for (const season of series.seasons) {
            if (season.season_number < seasonNumber) {
                absoluteCount += season.episode_count;
            } else if (season.season_number === seasonNumber) {
                absoluteCount += episodeNumberInSeason;
                break;
            }
        }
        return absoluteCount;
    };

    // Zapisywanie postępu
    const handleMarkEpisode = async (seasonNum, epNumInSeason) => {
        if (isUpdating || !userProgress) return;
        setIsUpdating(true);

        const clickedAbsoluteNum = calculateAbsoluteEpisodeNumber(seasonNum, epNumInSeason);
        const currentWatched = userProgress.episodes_watched || 0;

        const isAlreadyWatched = clickedAbsoluteNum <= currentWatched;
        const newWatchedCount = isAlreadyWatched ? clickedAbsoluteNum - 1 : clickedAbsoluteNum;

        const totalEps = series.number_of_episodes;

        let newStatus = "W trakcie";
        if (newWatchedCount >= totalEps) newStatus = "Ukończone";
        if (newWatchedCount === 0) newStatus = "Planowane";

        const result = await updateSeriesProgress(id, {
            episodes_watched: newWatchedCount,
            status: newStatus
        });

        if (result.success) {
            setUserProgress((prev) => ({
                ...prev,
                episodes_watched: newWatchedCount,
                status: newStatus
            }));
        }
        setIsUpdating(false);
    };

    if (!series) {
        return (
            <div className="series-details-page loading-page">
                <div className="details-orb details-orb-one"></div>
                <div className="details-orb details-orb-two"></div>
                <div className="loading-card">
                    <div className="loading-spinner"></div>
                    <p>Ładowanie detali serialu...</p>
                </div>
            </div>
        );
    }

    // Zmienne do paska postępu
    const totalEpisodes = series.number_of_episodes || 1;
    const watched = userProgress?.episodes_watched || 0;
    const progressPercent = Math.round((watched / totalEpisodes) * 100);

    return (
        <div className="series-details-page">
            <div className="details-grid"></div>
            <div className="details-particles">
                {Array.from({ length: 15 }).map((_, i) => <span key={i}></span>)}
            </div>
            <div className="details-orb details-orb-one"></div>
            <div className="details-orb details-orb-two"></div>
            <div className="details-orb details-orb-three"></div>

            <div className="series-details-container">
                <section className="series-header">
                    <div className="series-header-copy">
                        <Link to="/" style={{ color: "#8b5cf6", textDecoration: "none", display: "inline-block", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "bold" }}>
                            Wróć do listy
                        </Link>
                        <h1 className="details-series-title">{series.name}</h1>
                        {series.overview && (
                            <p className="series-overview">
                                {series.overview}
                            </p>
                        )}

                        {/* Jeśli serial jest na liście to usuń a jeżeli nie ma to dodaj*/}
                        {userProgress ? (
                            <>
                                <button
                                    onClick={handleRemoveSeries}
                                    style={{
                                        marginTop: "15px", background: "transparent",
                                        border: "1px solid rgba(239, 68, 68, 0.5)", color: "#ef4444",
                                        padding: "6px 12px", borderRadius: "8px", cursor: "pointer",
                                        fontSize: "0.85rem", fontWeight: "bold"
                                    }}
                                >
                                    Usuń serial z listy
                                </button>

                                {/* WIDŻET POSTĘPU UŻYTKOWNIKA */}
                                <div style={{ marginTop: "2rem", background: "rgba(0,0,0,0.4)", padding: "1rem 1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                                        <span style={{ color: "#a1a1aa" }}>Status: <strong style={{ color: "#22d3ee" }}>{userProgress.status}</strong></span>
                                        <span style={{ color: "#e4e4f0", fontWeight: "bold" }}>{watched} / {totalEpisodes} obejrzanych ({progressPercent > 100 ? 100 : progressPercent}%)</span>
                                    </div>
                                    <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ width: `${progressPercent > 100 ? 100 : progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #8b5cf6, #ec4899)", transition: "width 0.4s ease-out" }}></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "15px" }}>
                                <button
                                    onClick={handleAddSeries}
                                    disabled={isUpdating}
                                    style={{
                                        background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                        color: "#fff", border: "none",
                                        padding: "10px 20px", borderRadius: "10px", cursor: isUpdating ? "wait" : "pointer",
                                        fontSize: "0.95rem", fontWeight: "bold",
                                        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                                        transition: "opacity 0.2s"
                                    }}
                                >
                                    {isUpdating ? "Dodawanie..." : "+ Dodaj do listy"}
                                </button>
                                {feedbackMsg && (
                                    <span style={{ fontSize: "0.9rem", color: feedbackMsg.includes("Błąd") ? "#ef4444" : "#10b981" }}>
                                        {feedbackMsg}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="series-stats-card">
                        <div className="series-stat">
                            <span className="series-stat-icon">⭐</span>
                            <strong>
                                {series.vote_average ? series.vote_average.toFixed(1) : "—"}
                            </strong>
                            <span>Ocena</span>
                        </div>
                        <div className="series-stat">
                            <span className="series-stat-icon">🎬</span>
                            <strong>{series.number_of_seasons}</strong>
                            <span>Sezonów</span>
                        </div>
                        <div className="series-stat">
                            <span className="series-stat-icon">📺</span>
                            <strong>{series.number_of_episodes}</strong>
                            <span>Odcinków</span>
                        </div>
                    </div>
                </section>

                <section className="seasons-section">
                    <div className="section-heading">
                        <div><h2>Lista sezonów</h2></div>
                    </div>

                    <div className="seasons-list">
                        {series.seasons.map((season, index) => {
                            const isActive = activeSeason === season.season_number;
                            return (
                                <article
                                    key={season.id}
                                    className={`season-card ${isActive ? "active" : ""}`}
                                    style={{ "--delay": `${index * 60}ms` }}
                                >
                                    <button type="button" className="season-toggle" onClick={() => handleSeasonClick(season.season_number)}>
                                        <div className="season-poster-wrap">
                                            {season.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w300${season.poster_path}`} alt={season.name} className="season-poster" />
                                            ) : (
                                                <div className="season-poster-placeholder">
                                                    <span>🎞️</span>
                                                    <small>Brak zdjęcia</small>
                                                </div>
                                            )}
                                        </div>
                                        <div className="season-main-info">
                                            <div className="season-number">SEZON {season.season_number}</div>
                                            <h3>{season.name}</h3>
                                            <p>{season.episode_count} {season.episode_count === 1 ? "odcinek" : "odcinków"}</p>
                                        </div>
                                        <div className="season-action">
                                            <span>{isActive ? "Zwiń" : "Rozwiń"}</span>
                                            <div className={`chevron ${isActive ? "open" : ""}`}>↓</div>
                                        </div>
                                    </button>

                                    {isActive && (
                                        <div className="episodes-panel">
                                            <div className="episodes-panel-inner">
                                                {episodes.length === 0 ? (
                                                    <div className="episodes-loading">
                                                        <div className="loading-spinner small"></div>
                                                        <span>Ładowanie odcinków...</span>
                                                    </div>
                                                ) : (
                                                    <div className="episodes-list">
                                                        {episodes.map((ep) => {
                                                            const absoluteNum = calculateAbsoluteEpisodeNumber(season.season_number, ep.episode_number);
                                                            const isWatched = userProgress && absoluteNum <= (userProgress.episodes_watched || 0);

                                                            return (
                                                                <article key={ep.id} className="episode-card" style={{ opacity: isWatched ? 0.6 : 1, transition: "opacity 0.3s" }}>
                                                                    <div className="episode-thumb-wrap">
                                                                        {ep.still_path ? (
                                                                            <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} className="episode-thumb" />
                                                                        ) : (
                                                                            <div className="episode-thumb-placeholder">Brak foto</div>
                                                                        )}
                                                                        <div className="episode-number-badge">
                                                                            EP {String(ep.episode_number).padStart(2, "0")}
                                                                        </div>
                                                                    </div>
                                                                    <div className="episode-content">
                                                                        <div className="episode-topline">
                                                                            <h4>{ep.name}</h4>
                                                                            <span className="episode-rating">⭐ {ep.vote_average ? ep.vote_average.toFixed(1) : "—"}</span>
                                                                        </div>
                                                                        <p className="episode-overview">
                                                                            {ep.overview || "Brak opisu dla tego odcinka."}
                                                                        </p>

                                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "1rem" }}>
                                                                            <div className="episode-meta" style={{ marginTop: 0 }}>
                                                                                <span>⏱ <strong>{ep.runtime || "?"} min</strong></span>
                                                                                <span>📅 <strong>{ep.air_date || "Nieznana data"}</strong></span>
                                                                            </div>

                                                                            {userProgress && (
                                                                                <button
                                                                                    onClick={() => handleMarkEpisode(season.season_number, ep.episode_number)}
                                                                                    disabled={isUpdating}
                                                                                    style={{
                                                                                        background: isWatched ? "rgba(16, 185, 129, 0.15)" : "rgba(139, 92, 246, 0.2)",
                                                                                        color: isWatched ? "#10b981" : "#c4b5fd",
                                                                                        border: `1px solid ${isWatched ? "rgba(16, 185, 129, 0.3)" : "rgba(139, 92, 246, 0.4)"}`,
                                                                                        padding: "6px 14px",
                                                                                        borderRadius: "8px",
                                                                                        fontSize: "0.85rem",
                                                                                        fontWeight: "bold",
                                                                                        cursor: isUpdating ? "wait" : "pointer",
                                                                                        transition: "all 0.2s"
                                                                                    }}
                                                                                >
                                                                                    {isWatched ? "Obejrzano ✓" : "Zaznacz"}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </article>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}