# SeriesTracker — Dokumentacja API

## 1. Informacje ogólne

Backend aplikacji **SeriesTracker** został zbudowany z wykorzystaniem **Node.js** i **Express.js**. API odpowiada za komunikację frontendu z **The Movie Database (TMDb)** oraz za zarządzanie listą seriali użytkownika przechowywaną w **Supabase**.

Domyślny adres lokalnego API: `http://localhost:5000`.

Komunikacja z TMDb wykorzystuje token przechowywany w zmiennej środowiskowej `TMDB`. Zapytania do TMDb wykonywane są w języku `pl-PL`.

## 2. Lista endpointów

| Metoda | Endpoint | Autoryzacja | Opis |
|---|---|---|---|
| GET | `/api/health` | Nie | Sprawdzenie działania serwera |
| GET | `/api/trending` | Nie | Pobranie trendujących seriali |
| GET | `/api/series/:id` | Nie | Pobranie szczegółów serialu |
| GET | `/api/series/:id/season/:seasonNumber` | Nie | Pobranie sezonu i listy odcinków |
| GET | `/api/search?query=` | Nie | Wyszukiwanie seriali |
| POST | `/api/user-series` | Tak | Dodanie serialu do listy użytkownika |
| GET | `/api/user-series` | Tak | Pobranie listy seriali użytkownika |
| DELETE | `/api/user-series/:seriesId` | Tak | Usunięcie serialu z listy |
| PATCH | `/api/user-series/:seriesId` | Tak | Aktualizacja serialu na liście |

## 3. GET `/api/health`

Sprawdza, czy backend aplikacji działa poprawnie.

**Autoryzacja:** niewymagana

**Odpowiedź `200 OK`:**

```json
{
  "status": "ok",
  "message": "SERWER DZIAŁA!"
}
```

## 4. GET `/api/trending`

Pobiera z TMDb listę seriali trendujących w ciągu ostatniego tygodnia. Endpoint wykorzystywany jest m.in. na stronie głównej aplikacji.

**Autoryzacja:** niewymagana

**TMDb:** `/3/trending/tv/week?language=pl-PL`

**Odpowiedź `200 OK`:** tablica seriali z `response.data.results`.

**Błąd `500`:**

```json
{ "message": "Błąd pobierania z TMDb" }
```

## 5. GET `/api/series/:id`

Pobiera szczegółowe informacje o wybranym serialu, w tym dane dotyczące sezonów.

**Autoryzacja:** niewymagana

| Parametr | Typ | Opis |
|---|---|---|
| `id` | number/string | ID serialu w TMDb |

**Przykład:** `GET /api/series/1399`

**TMDb:** `/3/tv/{id}?language=pl-PL`

**Odpowiedź `200 OK`:** pełny obiekt serialu otrzymany z TMDb.

**Błąd `500`:**

```json
{ "message": "Błąd pobierania szegłówów seriali z TMDb" }
```

## 6. GET `/api/series/:id/season/:seasonNumber`

Pobiera informacje o wybranym sezonie serialu oraz listę jego odcinków.

**Autoryzacja:** niewymagana

| Parametr | Typ | Opis |
|---|---|---|
| `id` | number/string | ID serialu w TMDb |
| `seasonNumber` | number | Numer sezonu |

**Przykład:** `GET /api/series/1399/season/1`

**TMDb:** `/3/tv/{id}/season/{seasonNumber}?language=pl-PL`

**Odpowiedź `200 OK`:** obiekt sezonu wraz z odcinkami.

**Błąd `500`:**

```json
{ "message": "Błąd pobierania odcinków z TMDb" }
```

## 7. GET `/api/search`

Wyszukuje seriale w TMDb na podstawie frazy przekazanej w parametrze `query`.

**Autoryzacja:** niewymagana

| Parametr | Typ | Wymagany | Opis |
|---|---|---|---|
| `query` | string | Tak | Fraza wyszukiwania |

**Przykład:** `GET /api/search?query=Breaking%20Bad`

**TMDb:** `/3/search/tv?query={query}&language=pl-PL`

**Odpowiedź `200 OK`:** tablica wyników wyszukiwania.

**Błąd `400`:**

```json
{ "message": "Brak frazy wyszukiwania" }
```

**Błąd `500`:**

```json
{ "message": "Błąd serwera przy wyszukiwaniu" }
```

## 8. POST `/api/user-series`

Dodaje serial do listy zalogowanego użytkownika w tabeli `user_series` w Supabase.

**Autoryzacja:** wymagana (`verifyToken`)

**Body:**

```json
{
  "seriesId": 1399,
  "status": "Planowane"
}
```

| Pole | Typ | Wymagane | Opis |
|---|---|---|---|
| `seriesId` | number | Tak | ID serialu w TMDb |
| `status` | string | Nie | Status serialu; domyślnie `Planowane` |

ID użytkownika pobierane jest z `req.user.id`.

**Odpowiedź `201 Created`:**

```json
{ "message": "Serial pomyłśnie dodany do listy" }
```

**Błąd `400`:** zwracany przy próbie ponownego dodania tego samego serialu.

```json
{ "message": "Ten serial już znajjduje się na twjej liście" }
```

**Błąd `500`:**

```json
{ "message": "Bład serwera przy dodawaniu serialu" }
```

## 9. GET `/api/user-series`

Pobiera seriale zapisane na liście aktualnie zalogowanego użytkownika.

**Autoryzacja:** wymagana (`verifyToken`)

Backend pobiera rekordy z `user_series` dla `req.user.id`, a następnie dla każdego serialu pobiera szczegóły z TMDb i dołącza je w polu `details`.

**Przykład:**

```http
GET /api/user-series
Authorization: Bearer <TOKEN>
```

**Odpowiedź `200 OK`:**

```json
[
  {
    "series_id": 1399,
    "status": "Oglądane",
    "episodes_watched": 12,
    "user_rating": 9,
    "details": {
      "id": 1399,
      "name": "Game of Thrones"
    }
  }
]
```

Jeżeli pobranie szczegółów pojedynczego serialu z TMDb się nie powiedzie, rekord użytkownika może zostać zwrócony bez pola `details`.

**Błąd `500`:**

```json
{ "message": "Błąd serwera przy pobieraniu serialu" }
```

## 10. DELETE `/api/user-series/:seriesId`

Usuwa serial z listy aktualnie zalogowanego użytkownika.

**Autoryzacja:** wymagana (`verifyToken`)

| Parametr | Typ | Opis |
|---|---|---|
| `seriesId` | number/string | ID serialu w TMDb |

**Przykład:** `DELETE /api/user-series/1399`

Rekord usuwany jest po `user_id` oraz `series_id`, dzięki czemu operacja dotyczy listy aktualnie zalogowanego użytkownika.

**Odpowiedź `200 OK`:**

```json
{ "message": "Serial usunięty z listy." }
```

**Błąd `500`:**

```json
{ "message": "Błąd serwera przy usuwaniu serialu." }
```

## 11. PATCH `/api/user-series/:seriesId`

Aktualizuje dane serialu znajdującego się na liście użytkownika.

**Autoryzacja:** wymagana (`verifyToken`)

**Body:**

```json
{
  "status": "Oglądane",
  "episodes_watched": 15,
  "user_rating": 9
}
```

| Pole | Opis |
|---|---|
| `status` | Status serialu na liście |
| `episodes_watched` | Liczba obejrzanych odcinków |
| `user_rating` | Ocena użytkownika |

Nie trzeba przesyłać wszystkich pól — aktualizowane są tylko wartości przekazane w żądaniu.

**Odpowiedź `200 OK`:**

```json
{
  "message": "Zaktualizowano pomyślnie.",
  "data": []
}
```

**Błąd `500`:**

```json
{ "message": "Błąd serwera przy aktualizacji." }
```

## 12. Autoryzacja

Middleware `verifyToken` zabezpiecza operacje dotyczące prywatnej listy użytkownika:

```text
POST   /api/user-series
GET    /api/user-series
DELETE /api/user-series/:seriesId
PATCH  /api/user-series/:seriesId
```

Po poprawnej weryfikacji tokenu ID użytkownika dostępne jest jako `req.user.id`.

## 13. Integracja z TMDb

Backend komunikuje się z TMDb przy użyciu biblioteki **Axios**. Token dostępu pobierany jest ze zmiennej środowiskowej `TMDB` i wysyłany jako:

```http
Authorization: Bearer <TMDB_TOKEN>
```

Wykorzystywane endpointy TMDb:

| Endpoint | Zastosowanie |
|---|---|
| `/3/trending/tv/week` | Trendujące seriale |
| `/3/tv/{id}` | Szczegóły serialu |
| `/3/tv/{id}/season/{seasonNumber}` | Sezony i odcinki |
| `/3/search/tv` | Wyszukiwanie seriali |

Dzięki komunikacji z TMDb przez backend token API nie musi być udostępniany bezpośrednio we frontendzie.
