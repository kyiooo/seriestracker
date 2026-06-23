import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, BookmarkPlus, Star, ChevronRight, ChevronLeft, Tv, Menu, X, TrendingUp, User, Settings } from "lucide-react";
import "../styles/HomePage.css";

//PRZYKŁADOWO, POTEM API
const TRENDING = [
  { id: 1, title: "The Last of Us",   genre: "Post-apokalipsa",     year: 2023, rating: 9.0, image: "https://images.unsplash.com/photo-1489846986031-7cea03ab8fd0?w=600&h=400&fit=crop&auto=format" },
  { id: 2, title: "Dark",             genre: "Sci-fi / Thriller",   year: 2017, rating: 8.8, image: "https://images.unsplash.com/photo-1633885274919-04b5af171f8c?w=600&h=400&fit=crop&auto=format" },
  { id: 3, title: "Severance",        genre: "Sci-fi / Dramat",     year: 2022, rating: 8.9, image: "https://images.unsplash.com/photo-1743431267979-43ace055f121?w=600&h=400&fit=crop&auto=format" },
  { id: 4, title: "True Detective",   genre: "Kryminał / Noir",     year: 2014, rating: 9.0, image: "https://images.unsplash.com/photo-1619213117400-cd7f8e40381f?w=600&h=400&fit=crop&auto=format" },
  { id: 5, title: "The Bear",         genre: "Dramat komediowy",    year: 2022, rating: 8.9, image: "https://images.unsplash.com/photo-1759576981262-95fd51a994a7?w=600&h=400&fit=crop&auto=format" },
  { id: 6, title: "Mindhunter",       genre: "Kryminał / Thriller", year: 2017, rating: 8.6, image: "https://images.unsplash.com/photo-1577975155771-d1c811051953?w=600&h=400&fit=crop&auto=format" },
];

//PRZYKŁADOWO, POTEM API
const SAMPLE_SERIES = [
  { id: 1, title: "Breaking Bad",    genre: "Dramat kryminalny", progress: 62, totalEpisodes: 62, status: "Ukończone", rating: 9.5, year: 2008, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=420&fit=crop&auto=format" },
  { id: 2, title: "Stranger Things", genre: "Sci-fi / Horror",   progress: 25, totalEpisodes: 34, status: "W trakcie", rating: 8.7, year: 2016, image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=420&fit=crop&auto=format" },
  { id: 3, title: "The Bear",        genre: "Dramat komediowy",  progress: 0,  totalEpisodes: 18, status: "Planowane", rating: 8.9, year: 2022, image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=420&fit=crop&auto=format" },
  { id: 4, title: "Severance",       genre: "Sci-fi / Thriller", progress: 9,  totalEpisodes: 18, status: "Oglądane",  rating: 8.8, year: 2022, image: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=300&h=420&fit=crop&auto=format" },
];

//POTEM POŁĄCZENIE Z BAZĄ DANYCH
const STATS = [
  { value: "247", label: "Odcinków obejrzanych" },
  { value: "18",  label: "Seriali na liście" },
  { value: "6",   label: "Ukończonych seriali" },
  { value: "3",   label: "W trakcie oglądania" },
];

function GlassCard({ children, className }) {
  return (
    <div className={`glass-card ${className || ""}`}>
      <div className="glass-card-border" />
      <div className="glass-card-fill" />
      <div className="glass-card-content">{children}</div>
    </div>
  );
}

function TrendingCarousel() {
  const [active, setActive] = useState(2);
  const total = TRENDING.length;

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

  const current = TRENDING[active];

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
            {TRENDING.map((series, idx) => {
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
          <p className="carousel-subtitle">{current.genre} · {current.year}</p>
          <div className="dots-row">
            {TRENDING.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === active ? "active" : ""}`}
                onClick={() => setActive(idx)}
                style={{ width: idx === active ? 24 : 8 }}
              />
            ))}
          </div>
          <button className="btn-add-to-list">
            <BookmarkPlus size={15} />
            Dodaj do listy
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Wszystkie");
  const filters = ["Wszystkie", "Oglądane", "W trakcie", "Ukończone", "Planowane"];
  const filtered = activeFilter === "Wszystkie"
    ? SAMPLE_SERIES
    : SAMPLE_SERIES.filter((s) => s.status === activeFilter);

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            <div className="logo-icon">
              🎬
            </div>
            <span className="logo-text">SERIES<span>TRACKER</span></span>
          </div>

<button className="navbar-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? <X size={22} /> : <Menu size={22} />}
</button>
</div>

<div className={`navbar-dropdown ${menuOpen ? "open" : ""}`}>
  <div className="dropdown-top">
    <div className="dropdown-avatar">
      <User size={18} />
    </div>
    <div>
      <p className="dropdown-title">Menu</p>
      <span className="dropdown-subtitle">SeriesTracker</span>
    </div>
  </div>

    <button className="navbar-dropdown-settings">
    <User size={16} />
    Profil
  </button>

  <a href="#library">Moja lista</a>
  <a href="#discover">Odkryj</a>
  <a href="#stats">Statystyki</a>

  <button className="navbar-dropdown-settings">
    <Settings size={16} />
    Ustawienia
  </button>


  <div className="navbar-dropdown-actions">
    <Link className="btn-outline dropdown-link-btn" to="/login">
      Zaloguj się
    </Link>

    <Link className="btn-primary dropdown-link-btn" to="/register">
      Zarejestruj się
    </Link>
  </div>
</div>
</nav>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Twój osobisty dziennik seriali
          </div>

          <h1 className="hero-title">
            ŚLEDŹ KAŻDY<br />
            <span className="hero-title-gradient">ODCINEK.</span>
          </h1>

          <p className="hero-desc">
            Zarządzaj swoją listą seriali, zaznaczaj obejrzane odcinki i nigdy nie zgub wątku — wszystko w jednym miejscu.
          </p>

          <div className="hero-buttons">
            <button className="btn-hero-primary">
              Zacznij za darmo
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      <section className="stats-bar">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <TrendingCarousel />
      <section className="mylist-section">
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
            {filtered.map((series) => {
              const pct = Math.round((series.progress / series.totalEpisodes) * 100);
              const statusClass = "status-" + series.status.replace(" ", "-");
              return (
                <div key={series.id} className="series-card">
                  <div className="series-poster">
                    <img src={series.image} alt={series.title} />
                    <div className="poster-overlay" />
                    <div className="poster-rating">
                      <Star size={10} style={{ fill: "#22d3ee", color: "#22d3ee" }} />
                      {series.rating}
                    </div>
                  </div>
                  <div className="series-body">
                    <div className={`status-badge ${statusClass}`}>{series.status}</div>
                    <div className="series-title">{series.title}</div>
                    <div className="series-meta">{series.genre} · {series.year}</div>
                    <div className="progress-row">
                      <span>{series.progress}/{series.totalEpisodes} odc.</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}

            <button className="add-card">
              <BookmarkPlus size={28} />
              <span>Dodaj serial</span>
            </button>
          </div>
        </div>
      </section>
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
              <button className="btn-cta">Utwórz konto</button>
            </div>
          </GlassCard>
        </div>
      </section>
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
            <a href="#">Polityka prywatności</a>
            <a href="#">Kontakt</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
