import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSeriesDetails, getSeasonDetails } from "../services/seriesService";
import "../styles/SeriesDetailsPage.css";

export default function SeriesDetailsPage() {
    const { id } = useParams();

    const [series, setSeries] = useState(null);
    const [activeSeason, setActiveSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);

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

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getSeriesDetails(id);
            setSeries(data);
        };

        fetchDetails();
    }, [id]);

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

    return (
        <div className="series-details-page">
            <div className="details-grid"></div>
            <div className="details-particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="details-orb details-orb-one"></div>
            <div className="details-orb details-orb-two"></div>
            <div className="details-orb details-orb-three"></div>
            <div className="series-details-container">
                <section className="series-header">
                    <div className="series-header-copy">
                        <h1 className="details-series-title">{series.name}</h1>
                        {series.overview && (
                            <p className="series-overview">
                                {series.overview}
                            </p>
                        )}
                    </div>
                    <div className="series-stats-card">
                        <div className="series-stat">
                            <span className="series-stat-icon">⭐</span>
                            <strong>
                                {series.vote_average
                                    ? series.vote_average.toFixed(1)
                                    : "—"}
                            </strong>
                            <span>Ocena</span>
                        </div>
                        <div className="series-stat">
                            <span className="series-stat-icon">🎬</span>
                            <strong>
                                {series.number_of_seasons}
                            </strong>
                            <span>Sezonów</span>
                        </div>
                        <div className="series-stat">
                            <span className="series-stat-icon">📺</span>
                            <strong>
                                {series.number_of_episodes}
                            </strong>
                            <span>Odcinków</span>
                        </div>
                    </div>
                </section>
                <section className="seasons-section">
                    <div className="section-heading">
                        <div><h2>Lista sezonów</h2></div>
                        <span className="season-count-badge">{series.seasons.length} pozycji</span>
                    </div>
                    <div className="seasons-list">
                        {series.seasons.map((season, index) => {
                            const isActive =
                                activeSeason === season.season_number;
                            return (
                                <article
                                    key={season.id}
                                    className={`season-card ${isActive ? "active" : ""
                                        }`}
                                    style={{
                                        "--delay": `${index * 60}ms`
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="season-toggle"
                                        onClick={() =>
                                            handleSeasonClick(
                                                season.season_number
                                            )
                                        }
                                    >
                                        <div className="season-poster-wrap">
                                            {season.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                                                    alt={season.name}
                                                    className="season-poster"
                                                />
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
                                            <p>
                                                {season.episode_count}{" "}
                                                {season.episode_count === 1
                                                    ? "odcinek"
                                                    : "odcinków"}
                                            </p>
                                        </div>
                                        <div className="season-action">
                                            <span>
                                                {isActive
                                                    ? "Zwiń"
                                                    : "Rozwiń"}
                                            </span>
                                            <div
                                                className={`chevron ${isActive
                                                        ? "open"
                                                        : ""
                                                    }`}
                                            >
                                                ↓
                                            </div>
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
                                                        {episodes.map((ep) => (
                                                            <article
                                                                key={ep.id}
                                                                className="episode-card"
                                                            >
                                                                <div className="episode-thumb-wrap">
                                                                    {ep.still_path ? (
                                                                        <img
                                                                            src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                                                                            alt={ep.name}
                                                                            className="episode-thumb"
                                                                        />
                                                                    ) : (
                                                                        <div className="episode-thumb-placeholder">Brak foto</div>
                                                                    )}
                                                                    <div className="episode-number-badge">
                                                                        EP{" "}
                                                                        {String(
                                                                            ep.episode_number
                                                                        ).padStart(
                                                                            2,
                                                                            "0"
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="episode-content">
                                                                    <div className="episode-topline">
                                                                        <h4>{ep.name}</h4>
                                                                        <span className="episode-rating">
                                                                            ⭐{" "}
                                                                            {ep.vote_average
                                                                                ? ep.vote_average.toFixed(
                                                                                    1
                                                                                )
                                                                                : "—"}
                                                                        </span>
                                                                    </div>
                                                                    <p className="episode-overview">
                                                                        {ep.overview ||
                                                                            "Brak opisu dla tego odcinka."}
                                                                    </p>
                                                                    <div className="episode-meta">
                                                                        <span>
                                                                            ⏱{" "}
                                                                            <strong>
                                                                                {ep.runtime ||
                                                                                    "?"}
                                                                                min
                                                                            </strong>
                                                                        </span>
                                                                        <span>
                                                                            📅{" "}
                                                                            <strong>
                                                                                {ep.air_date ||
                                                                                    "Nieznana data"}
                                                                            </strong>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </article>
                                                        ))}
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