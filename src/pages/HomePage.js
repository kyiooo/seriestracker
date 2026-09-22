import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, BookmarkPlus, Star, ChevronRight, ChevronLeft, Menu, X, TrendingUp, User, Settings, LogOut, Trash2 } from "lucide-react";
import "../styles/HomePage.css";
import {getTrending, addSeriesToList, getUserSeries, removeSeriesFromList} from "../services/seriesService";
import { supabase } from "../services/supabaseClient";

function GlassCard({ children, className }) {
  return (
      <div className={`glass-card ${className || ""}`}>
        <div className="glass-card-border" />
        <div className="glass-card-fill" />
        <div className="glass-card-content">{children}</div>
      </div>
  );
}


// Przekazujemy usera, żeby komponent wiedział, czy wpuścić  czy wywalić do rejestracji
function TrendingCarousel({ user, onSeriesAdded}) {
  const [trending, setTrending] = useState([]);
  const [active, setActive] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  },[trending.length]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrending();
      if (data && data.length > 0) {
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.name || item.original_name || item.title,
          genre: "Serial",
          year: item.first_air_date ? item.first_air_date.substring(0, 4) : "Brak",
          rating: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
          image: item.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
              : `https://image.tmdb.org/t/p/w500${item.poster_path}`
        }));
        setTrending(formattedData);
      }
    };
    fetchData();
  }, []);

  const total = trending.length;

  if (total === 0) {
    return (
        <section className="trending-section">
          <div className="container-lg" style={{ textAlign: "center", color: "white", padding: "50px 0" }}>
            Ładowanie trendów z serwera...
          </div>
        </section>
    );
  }

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  const getOffset = (idx) => {
    let d = idx - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const getStyle = (offset) => {
    const abs = Math.abs(offset);
    if (abs > 2) return { opacity: 0, pointerEvents: "none", transform: "translateX(0) scale(0.5)" };
    return {
      transform: `translateX(${offset * 280}px) scale(${offset === 0 ? 1 : abs === 1 ? 0.78 : 0.62})`,
      zIndex: 10 - abs * 3,
      opacity: offset === 0 ? 1 : abs === 1 ? 0.75 : 0.45,
      filter: `brightness(${offset === 0 ? 1 : abs === 1 ? 0.6 : 0.35})`,
      transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  const current = trending[active];

  const handleAddToList = async () => {
    if (!current) return;

    // Zabezpieczenie przed niezalogowanymi
    if (!user) {
      navigate('/register');
      return;
    }

    setIsAdding(true);
    setFeedbackMsg("");

    const result = await addSeriesToList(current.id, "Planowane");

    setFeedbackMsg(result.message);
    setIsAdding(false);
    if (result.success && onSeriesAdded) {
      onSeriesAdded();
    }

    setTimeout(() => {
      setFeedbackMsg("");
    }, 3000);
  };

  return (
      <section className="trending-section">
        <div className="container-lg">
          <div className="trending-header">
            <div>
              <p className="trending-label">Na czasie</p>
              <h2 className="trending-title">
                <TrendingUp size={32} color="#8b5cf6" />
                TRENDY TERAZ
              </h2>
            </div>
            <div className="trending-counter">
              <span>{String(active + 1).padStart(2, "0")}</span>
              <span className="trending-counter-line" />
              <span>{String(total).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="carousel-track">
            <button className="carousel-btn carousel-btn-prev" onClick={prev}>
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-slides">
              {trending.map((series, idx) => {
                const offset = getOffset(idx);
                const isActive = offset === 0;
                return (
                    <div
                        key={series.id}
                        className="carousel-slide"
                        onClick={() => setActive(idx)}
                        style={getStyle(offset)}
                    >
                      <img src={series.image} alt={series.title} />
                      {isActive && (
                          <>
                            <div className="carousel-overlay" />
                            <div className="carousel-info">
                              <div className="carousel-rating">
                                <Star size={12} style={{ fill: "#22d3ee", color: "#22d3ee" }} />
                                <span style={{ color: "#22d3ee", fontWeight: 500 }}>{series.rating}</span>
                                <span style={{ color: "rgba(255,255,255,0.5)" }}>· {series.year}</span>
                              </div>
                              <div className="carousel-title">{series.title}</div>
                              <div className="carousel-genre">{series.genre}</div>

                              <Link to={`/series/${series.id}`} className="carousel-details-btn">
                                Zobacz szczegóły <ChevronRight size={15} />
                              </Link>
                            </div>
                          </>
                      )}
                    </div>
                );
              })}
            </div>

            <button className="carousel-btn carousel-btn-next" onClick={next}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="carousel-dots">
            <p className="carousel-subtitle">{current?.genre} · {current?.year}</p>
            <div className="dots-row">
              {trending.map((_, idx) => (
                  <button
                      key={idx}
                      className={`dot ${idx === active ? "active" : ""}`}
                      onClick={() => setActive(idx)}
                      style={{ width: idx === active ? 24 : 8 }}
                  />
              ))}
            </div>
            <button
                className="btn-add-to-list"
                onClick={handleAddToList}
                disabled={isAdding}
                style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? "wait" : "pointer" }}
            >
              <BookmarkPlus size={15} />
              {isAdding ? "Dodawanie..." : "Dodaj do listy"}
            </button>

            {feedbackMsg && (
                <span style={{
                  fontSize: "0.85rem",
                  color: feedbackMsg.includes("już") || feedbackMsg.includes("zalogowany") ? "#ef4444" : "#10b981",
                  marginTop: "8px"
                }}>
                  {feedbackMsg}
                </span>
            )}
          </div>
        </div>
      </section>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Stany logowania
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [mySeries, setMySeries] = useState([]);

  const [activeFilter, setActiveFilter] = useState("Wszystkie");
  const filters = ["Wszystkie", "W trakcie", "Ukończone", "Planowane"];

  // Odświezanie listy po dodaniu serialu
  // Nie działa z niewiadomych przyczyn
  const refreshMySeries = async () => {
    const seriesData = await getUserSeries();
    setMySeries(seriesData);
  };

  // Sprawdzanie sesji przy wejściu na stronę
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        // Pobieramy nazwę z tabeli
        const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();

        if (profile) setUserName(profile.username);

        // Pobieramy seriale zapisane w poffilu usera
        const seriesData = await getUserSeries();
        setMySeries(seriesData);
      }
    };

    fetchUserData();
  }, []);



  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName("");
    setMySeries([]);
    setMenuOpen(false);
  };

  const handleDeleteSeries = async (e, seriesId) => {
    e.preventDefault();
    const result = await removeSeriesFromList(seriesId);
    if (result.success) {
      // Aktualizacja listy
      setMySeries(prev => prev.filter(s => s.series_id !== seriesId));
    }
  };


  // Statystyki z bazy danych dla konkretnego uzytkownika
  const dynamicStats = [
    { value: mySeries.reduce((acc, s) => acc + (s.episodes_watched || 0), 0), label: "Odcinków obejrzanych" },
    { value: mySeries.length, label: "Seriali na liście" },
    { value: mySeries.filter(s => s.status === "Ukończone").length, label: "Ukończonych seriali" },
    { value: mySeries.filter(s => s.status === "W trakcie" ).length, label: "W trakcie oglądania" },
  ];

  const filtered = activeFilter === "Wszystkie"
      ? mySeries
      : mySeries.filter((s) => s.status === activeFilter);

  return (
      <div className="homepage">
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-logo">
              <div className="logo-icon">🎬</div>
              <span className="logo-text">SERIES<span>TRACKER</span></span>
            </div>

            {/* Wyświetlanie nazwy użytkownika obok menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {user && (
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e4e4f0' }}>
                    {userName}
                  </span>
              )}
              <button className="navbar-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <div className={`navbar-dropdown ${menuOpen ? "open" : ""}`}>
            <div className="dropdown-top">
              <div className="dropdown-avatar">
                <User size={18} />
              </div>
              <div>
                <p className="dropdown-title">{user ? userName : "Menu"}</p>
                <span className="dropdown-subtitle">SeriesTracker</span>
              </div>
            </div>

            {user ? (
                <>
                  <button className="navbar-dropdown-settings">
                    <User size={16} /> Mój Profil
                  </button>
                  <a href="#mylist">Moja lista</a>
                  <a href="#stats">Statystyki</a>
                  <button className="navbar-dropdown-settings">
                    <Settings size={16} /> Ustawienia
                  </button>
                  <div className="navbar-dropdown-actions">
                    <button onClick={handleLogout} className="btn-outline dropdown-link-btn" style={{ width: '100%', gap: '8px' }}>
                      <LogOut size={16} /> Wyloguj się
                    </button>
                  </div>
                </>
            ) : (
                <>
                  <a href="#discover">Odkryj</a>
                  <div className="navbar-dropdown-actions">
                    <Link className="btn-outline dropdown-link-btn" to="/login">Zaloguj się</Link>
                    <Link className="btn-primary dropdown-link-btn" to="/register">Zarejestruj się</Link>
                  </div>
                </>
            )}
          </div>
        </nav>

        {!user && (
            <section className="hero">
              <div className="hero-bg" />
              <div className="hero-grid" />
              <div className="hero-particles">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
              </div>
              <div className="hero-orb hero-orb-1" />
              <div className="hero-orb hero-orb-2" />
              <div className="hero-orb hero-orb-3" />

              <div className="hero-inner">
                <h1 className="hero-title">
                  ŚLEDŹ KAŻDY<br />
                  <span className="hero-title-gradient">ODCINEK.</span>
                </h1>
                <p className="hero-desc">
                  Zarządzaj swoją listą seriali, zaznaczaj obejrzane odcinki i nigdy nie zgub wątku — wszystko w jednym miejscu.
                </p>
                <div className="hero-buttons">
                  <Link to="/register" className="btn-hero-primary" style={{ textDecoration: 'none' }}>
                    Zacznij za darmo
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </section>
        )}

        {/* Pasek statystyk - dla zalogowanych */}
        {user && (
            <section className="stats-bar" id="stats" style={{ marginTop: '76px' }}>
              <div className="stats-grid">
                {dynamicStats.map((s) => (
                    <div key={s.label} className="stat-item">
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                ))}
              </div>
            </section>
        )}

        <TrendingCarousel user={user} onSeriesAdded={refreshMySeries} />


        {/* Lista użytkownika - gdy uykownik jest zalogowany */}
        {user && (
            <section className="mylist-section" id="mylist">
              <div className="container-lg">
                <div className="mylist-header">
                  <div>
                    <p className="section-label">Podgląd</p>
                    <h2 className="section-title">MOJA LISTA</h2>
                  </div>
                  <div className="filter-buttons">
                    {filters.map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                            onClick={() => setActiveFilter(f)}
                        >
                          {f}
                        </button>
                    ))}
                  </div>
                </div>

                <div className="series-grid">
                  {filtered.length > 0 ? filtered.map((series) => {
                    const totalEp = series.details?.number_of_episodes || 1;
                    const watched = series.episodes_watched || 0;
                    const pct = Math.round((watched / totalEp) * 100);
                    const statusClass = "status-" + series.status.replace(" ", "-");

                    const posterUrl = series.details?.poster_path
                        ? `https://image.tmdb.org/t/p/w500${series.details.poster_path}`
                        : "https://via.placeholder.com/300x450?text=Brak+plakatu";

                    return (
                        <Link to={`/series/${series.series_id}`} key={series.id} className="series-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <button
                              onClick={(e) => handleDeleteSeries(e, series.series_id)}
                              style={{
                                position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                                background: 'rgba(0, 0, 0, 0.7)',
                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                borderRadius: '50%', width: '32px', height: '32px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: '#ef4444', cursor: 'pointer',
                                backdropFilter: 'blur(4px)'
                              }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="series-poster">
                          <div className="series-poster">
                            <img src={posterUrl} alt={series.details?.name} />
                            <div className="poster-overlay" />
                            <div className="poster-rating">
                              <Star size={10} style={{ fill: "#22d3ee", color: "#22d3ee" }} />
                              {series.details?.vote_average ? series.details.vote_average.toFixed(1) : "Brak"}
                            </div>
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0,
                              height: '4px', background: 'rgba(255,255,255,0.2)', zIndex: 10
                            }}>
                              <div style={{
                                width: `${pct > 100 ? 100 : pct}%`, height: '100%',
                                background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                                boxShadow: '0 0 8px rgba(236,72,153,0.6)'
                              }}></div>
                            </div>
                          </div>
                          <div className="series-body">
                            <div className={`status-badge ${statusClass}`}>{series.status}</div>
                            <div className="series-title">{series.details?.name || "Brak tytułu"}</div>
                            <div className="series-meta">
                              Serial · {series.details?.first_air_date ? series.details.first_air_date.substring(0, 4) : ""}
                            </div>
                            <div className="progress-row">
                              <span>{watched}/{totalEp} odc.</span>
                              <span>{pct > 100 ? 100 : pct}%</span>
                            </div>
                          </div>
                          </div>
                        </Link>
                    );
                  }) : (
                      <div style={{ color: "#71717a", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
                        Brak seriali w tej kategorii.
                      </div>
                  )}

                  <a href="#discover" className="add-card" style={{ textDecoration: 'none' }}>
                    <BookmarkPlus size={28} />
                    <span>Dodaj z trendów</span>
                  </a>
                </div>
              </div>
            </section>
        )}


        {/* Ficzery dla niezalogowanych */}
        {!user && (
            <>
              <section className="features-section">
                <div className="container-lg">
                  <div className="features-header">
                    <p className="section-label">Funkcje</p>
                    <h2 className="section-title">WSZYSTKO CZEGO POTRZEBUJESZ</h2>
                  </div>
                  <div className="features-grid">
                    {[
                      { icon: <CheckCircle size={24} color="#34d399" />, title: "Śledzenie odcinków",  desc: "Zaznaczaj obejrzane odcinki sezon po sezonie. Aplikacja zapamiętuje Twój postęp." },
                      { icon: <Clock size={24} color="#22d3ee" />,        title: "Statusy seriali",    desc: "Oglądane, W trakcie, Ukończone, Planowane — pełna kontrola nad Twoją listą." },
                      { icon: <Star size={24} color="#ec4899" />,          title: "Oceny i notatki",   desc: "Dodawaj własne oceny i notatki do każdego serialu. Twoja lista, Twoje zdanie." },
                    ].map((f) => (
                        <GlassCard key={f.title}>
                          <div className="feature-body">
                            <div className="feature-icon">{f.icon}</div>
                            <div className="feature-title">{f.title}</div>
                            <div className="feature-desc">{f.desc}</div>
                          </div>
                        </GlassCard>
                    ))}
                  </div>
                </div>
              </section>

              <section className="cta-section">
                <div className="cta-inner">
                  <GlassCard>
                    <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
                      <h2 className="cta-title">GOTOWY DO<br />ŚLEDZENIA?</h2>
                      <p className="cta-desc">Dołącz i zacznij zarządzać swoją listą seriali już dziś.</p>
                      <Link to="/register" className="btn-cta" style={{ textDecoration: 'none', display: 'inline-block' }}>Utwórz konto</Link>
                    </div>
                  </GlassCard>
                </div>
              </section>
            </>
        )}

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">
              <div className="footer-logo-icon">🎬</div>
              <span style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>
                SERIES<span style={{ color: "#8b5cf6" }}>TRACKER</span>
              </span>
            </div>
            <p>Projekt ISI · Informatyka 235IC A2 · Małgorzata Andrzejewska · 2026</p>
            <div className="footer-links">
              <button type="button">Polityka prywatności</button>
              <button type="button">Kontakt</button>
            </div>
          </div>
        </footer>
      </div>
  );
}