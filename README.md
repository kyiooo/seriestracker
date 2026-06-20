# Projekt ISI - Series Tracker 🎬

### Dane autora: 
+ **Imię i nazwisko:** [Małgorzata Andrzejewska]
+ **Kierunek:** [Informatyka]
+ **Grupa:** [235IC A2]

---
## Opis projektu 

SeriesTracker 🎬 to aplikacja webowa służąca do zarządzania osobistą listą seriali. System umożliwia użytkownikom śledzenie postępu oglądania, organizowanie seriali, zarządzanie własną biblioteką oraz kontrolowanie obejrzanych odcinków w jednym miejscu.

---

## 🚀 Funkcjonalności

- Rejestracja i logowanie użytkowników
- Dodawanie seriali do własnej listy
- Śledzenie postępu oglądania
- Oznaczanie obejrzanych odcinków
- Zarządzanie statusem:
  - Oglądane
  - W trakcie
  - Ukończone
  - Planowane
- Edycja i usuwanie pozycji
- Responsywny interfejs użytkownika
- Integracja z bazą danych Supabase
- Testy backendu

---

## 🛠 Stos technologiczny

#### Frontend
- React
- React Router
- Axios
- CSS

#### Backend
- Node.js
- Express.js

#### Baza danych
- Supabase (PostgreSQL)

#### Testowanie
- Jest

#### DevOps i wdrożenie
- Docker
- Docker Compose
- Render

---

## 🏗 Architektura systemu
```
                    ┌──────────────────┐
                    │   Użytkownik     │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌─────────────────────────────┐
                 │      React Frontend         │
                 │─────────────────────────────│
                 │ • Interfejs użytkownika     │
                 │ • Routing                   │
                 │ • Axios                     │
                 └───────────┬─────────────────┘
                             │

                        HTTP / REST

                             │
                             ▼
        ┌──────────────────────────────────────────┐
        │            Docker Environment (Compose)  │
        │                                          │
        │   ┌────────────────────────────────────┐ │
        │   │          Node.js + Express API     │ │
        │   │────────────────────────────────────│ │
        │   │ • Endpointy API                    │ │
        │   │ • Logika biznesowa                 │ │
        │   │ • Middleware                       | │
        │   │ • Walidacja danych                 │ │
        │   └─────────────┬──────────────────────┘ │
        │                 │                        │
        │                 ▼                        │
        │         ┌─────────────────┐              │
        │         │ Jest            │              │
        │         │ Unit Test       │              │ 
        |         │ API Integration │              │ 
        │         └─────────────────┘              │
        └──────────────────────────────────────────┘
                             │

                        CRUD / AUTH API

                             │
                             ▼
                ┌─────────────────────────┐
                │       Supabase          │
                │─────────────────────────│
                │ PostgreSQL Database     │
                │ Auth / JWT              │
                └───────────┬─────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │    Render Cloud       │
                 │ Production Deployment │
                 └───────────────────────┘
```
---

## 🗄 Schemat bazy danych

1. Users:
- user_series
- watched_episodes
- favorites

2. Series:
- seasons
- series_genres
- user_series
- favorites
3. Seasons: 
- episodes
4. Episodes:
- watched_episodes
5. Genres:
- series_genres

#### Tabele: 
+ users – przechowuje dane użytkownika 
+ series – przechowuje dane seriali 
+ genres – przechowuje gatunek seriali 
+ series_genres – łączy seriale z gatunkiem 
+ seasons – przechowuje sezony seriali 
+ episodes – przechowuje odcinki sezonów 
+ user_series – przechowuje seriale dodane do biblioteki użytkownika 
+ watched_episodes – zapisuje obejrzane odcinki użytkownika 
+ favorites – przechowuje ulubione seriale użytkownika 

Baza danych będzie przechowywać użytkowników, seriale, sezony, odcinki oraz informacje o postępie oglądania. Każdy użytkownik będzie mógł dodawać seriale do własnej biblioteki, oznaczać odcinki jako obejrzane, ustawiać status oglądania oraz dodawać seriale do ulubionych.

![schematbazydanych](https://i.postimg.cc/wjRFfV7d/image.png)

--- 

## 🧪 Testy

Projekt wykorzystuje testy jednostkowe i integracyjne w celu zapewnienia poprawności działania aplikacji.

Zakres testów obejmuje:

- logowanie i rejestrację użytkownika
- endpointy API
- walidację danych wejściowych
- logikę biznesową
- obsługę błędów
- autoryzację

Minimalny wymagany poziom pokrycia kodu testami:

```text
60%
```

Uruchomienie testów:

```bash
npm test
```

Uruchomienie wraz z raportem pokrycia:

```bash
npm run test:coverage
```

Przykładowy test:\
-do dodania-

---

## ⚙️ Instalacja

## Klonowanie repozytorium

```bash
git clone https://github.com/kyiooo/seriestracker.git

cd SeriesTracker
```

## Konfiguracja .env

Backend:

```env
PORT=5000
SUPABASE_URL= hidden
SUPABASE_KEY= hidden
```

Frontend:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🐳 Uruchomienie Docker

Budowanie i start:

```bash
docker-compose up --build
```

Aplikacja będzie dostępna:

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

---

## 🌍 Wersja live

[Series Tracker 🎬](https://series-tracker.onrender.com)

---

### Dokumentacja
Więcej informacji o frameworku znajdziesz tutaj: \
[Express](https://expressjs.com/) |
[Node.js](https://nodejs.org/docs/latest/api/) |
[React](https://react.dev/learn)
---
