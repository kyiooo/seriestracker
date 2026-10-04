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
  - Wszystkie
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
                              ┌──────────────────────┐
                              │      Użytkownik      │
                              └──────────┬───────────┘
                                         │
                                         ▼
                    ┌────────────────────────────────────┐
                    │          React Frontend            │
                    │────────────────────────────────────│
                    │ • Interfejs użytkownika            │
                    │ • React Router                     │
                    │ • Axios                            │
                    │ • CSS                              │
                    │ • Supabase Client                  │
                    └─────────┬───────────────┬──────────┘
                              │               │
                    HTTP/REST │               │ Auth / Session
                    JSON      │               │
                              ▼               ▼
              ┌──────────────────────┐   ┌─────────────────────┐
              │ Node.js + Express    │   │    Supabase Auth    │
              │      REST API        │   │─────────────────────│
              │──────────────────────│   │ • Rejestracja       │
              │ • Endpointy REST     │   │ • Logowanie         │
              │ • Logika backendu    │   │ • Sesja użytkownika │
              │ • Middleware         │   │ • JWT / Access Token│
              │ • verifyToken        │   └──────────┬──────────┘
              └──────┬────────┬──────┘              │
                     │        │                     │
          Axios/HTTP │        │ Supabase API        │
                     │        │                     │
                     ▼        ▼                     ▼
        ┌────────────────┐  ┌────────────────────────────┐
        │    TMDb API    │  │         Supabase           │
        │────────────────│  │────────────────────────────│
        │ • Trendy       │  │ PostgreSQL Database        │
        │ • Seriale      │  │                            │
        │ • Sezony       │  │ • profiles                 │
        │ • Odcinki      │  │ • user_series              │
        └────────────────┘  │ • dane użytkownika         │
                            │ • postęp oglądania         │
                            └────────────────────────────┘


 ┌─────────────────────────────────────────────────────────────────┐
 │                  Docker / Docker Compose                        │
 │─────────────────────────────────────────────────────────────────│
 │                                                                 │
 │      ┌────────────────────┐       ┌────────────────────┐        │
 │      │ Frontend Container │       │ Backend Container  │        │
 │      │ React / Node 22    │       │ Node 22 / Express  │        │
 │      │ Port 5000          │       │ Port 3000          │        │
 │      └────────────────────┘       └────────────────────┘        │
 │                                                                 │
 └─────────────────────────────────────────────────────────────────┘


                    ┌──────────────────────────┐
                    │          Jest            │
                    │──────────────────────────│
                    │ • Testy jednostkowe      │
                    │ • Testy integracyjne     │
                    │ • Testowanie API         │
                    └──────────────────────────┘


                    ┌──────────────────────────┐
                    │       Render Cloud       │
                    │──────────────────────────│
                    │ Production Deployment    │
                    │ SeriesTracker            │
                    └──────────────────────────┘
```
---

## 🗄 Schemat bazy danych

1. profiles:
- id
- username
- email
- created_at

2. user_series:
- id
- user_id
- series_id
- status
- episodes_watched
- user_rating
- created_at

### Tabele:

Tabela `profiles` przechowuje dane o profilach użytkowników

Tabela `user_series` przechowuje informacje o serialach przypisanych do konkretnego użytkownika oraz o postępach w ich oglądaniu

![schematbazydanych](https://i.postimg.cc/7L5GGnDH/image.png)

--- 

## 🧪 Testy

Projekt wykorzystuje testy jednostkowe i integracyjne w celu zapewnienia poprawności działania aplikacji.

Zakres testów obejmuje:

- endpointy API
- walidację danych wejściowych
- logikę biznesową
- obsługę błędów
- autoryzację

Minimalny wymagany poziom pokrycia kodu testami:

```text
60%
```

Aktualny poziom pokrycia kodu testami:

Pokrycie instrukcji:
```text
81.87%
```

Pokrycie linii kodu:
```text
85.06%
```

Uruchomienie testów:

```bash
npm test
```

Przykładowy test dodawania serialu do listy użytkownika:
```bash
test("addSeriesToList sukces", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.post.mockResolvedValueOnce({ data: { message: "Dodano" } });

        const res = await addSeriesToList(1, "Planowane");
        expect(res.success).toBe(true);
        expect(res.message).toBe("Dodano");
    });
```

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
PORT=3000
TMDB= hidden
SUPABASE_URL= hidden
SUPABASE_KEY= hidden
```

Frontend:

```env
PORT=5000
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SUPABASE_URL= hidden
REACT_APP_SUPABASE_KEY= hidden
```

---

## 🐳 Uruchomienie Docker

Budowanie i start:

```bash
docker-compose up -d --build
```

Wyłączanie:

```bash
docker-compose down #zatrzymanie i usunięcie kontenerów oraz utworzonej sieci, zachowując pobrane obrazy i dane wolumenów
docker-compose stop #zatrzymanie kontenerów bez ich usuwania, co pozwala na szybszy powrót do pracy poleceniem docker-compose start
docker-compose down -y #usuwa kontenery, sieć oraz wszystkie powiązane wolumeny
```

Aplikacja będzie dostępna:

Frontend:

```text
http://localhost:5000
```

Backend:

```text
http://localhost:3000
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
