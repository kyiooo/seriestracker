# Sprawozdanie z projektu SeriesTracker

---

**Temat:** Zintegrowany system do zarządzania osobistą listą seriali, pozwalający śledzić postęp oglądania
### Dane autora: 
+ **Imię i nazwisko:** [Małgorzata Andrzejewska]
+ **Kierunek:** [Informatyka]
+ **Grupa:** [235IC A2]
+ **Link do repo na github:** https://github.com/kyiooo/

---

## FAZA 1 Inicjalizacja projektu oraz konfiguracja środowiska

1. Upewniłam się, że mam zainstalowanego Gita, Node'a i menedżera pakietów npm, po czym skonfigurowałam Gita w terminalu.

![GIT](https://i.postimg.cc/FKR5FG0m/image.png)

Następnie skonfigurowałam odpowiednio klucze SSH by bezpiecznie komunikować się z Githubem.

![GIT1](https://i.postimg.cc/X77gzhW9/image.png)
![GIT2](https://i.postimg.cc/Y9vvF6BH/image.png)

2. Utworzyłam i wypełniłam plik `README.md` wymaganą treścią

3. Przygotowanie środowiska Node.js

Wykonałam odpowiednie instalacje:

![npm](https://i.postimg.cc/Qd17fGCG/image.png)
![npm1](https://i.postimg.cc/7PJS524L/image.png)
![npm2](https://i.postimg.cc/655wHdQN/image.png)

Wybrałam do swojej struktury FrontEnd Reacta

![npm3](https://i.postimg.cc/g0f8szq0/image.png)

Pierwsze odpalenie aplikacji React w localhoscie

![npm4](https://i.postimg.cc/J797hy77/image.png)

4. Inicjaliacja Git : `git init`

![git init](https://i.postimg.cc/zXrBjLsw/image.png)

5. Utworzenie pliku `.gitignore`

![gitignore](https://cdn.discordapp.com/attachments/797491927817650177/1508860836066627784/image.png?ex=6a1713a8&is=6a15c228&hm=a23a2714a8af25bc15496277e98509612a5951e28941073f95acf1b30d90e1c5&)

6. Zaprojektowałam bazę danych podaną w `README.md` na Supabase, lącząc się z Githubem

![schematbazydanych](https://cdn.discordapp.com/attachments/797491927817650177/1508820319283183757/image.png?ex=6a16edec&is=6a159c6c&hm=a08b479eb9c104b950501fdbac18b7cb7dc7623eac7fdc48f50ceed3781fce7b&)

7. Skonfigurowałam środowisko:
Dodałam pliki:
```
.env
LICENSE
.eslintrc.json
```

Uzupełniłam plik `.env` o supabase_url i supabase_key

Kończę fazę 1 commitem do lokalnego repozytorium:
```
git status
git branch -m master main
git add .
git commit -m "Initial commit: Project structure"

```

Później połączyłam lokalne repozytorium ze zdalnym:
https://github.com/kyiooo/seriestracker.git

## FAZA 1,5 Tworzenie aplikacji

Kolejnym etapem było zbudowanie przeze mnie aplikacji, na początku utworzyłam nowy branch `feature/login-page` oraz w następnych etapach `feature/register-page`. W obu przypadkach najpierw zajęłam się ui.
W bazie danych utorzyłam specjalne polices by dane byly bezpieczne, skonfirugowałam potwierdzenie rejestracji przez email.
Następnie dodałam funkcjonalność do wszystkich przycisków oraz przechodzenie przez routingi.

Kolejno przeszłam do tworzenia home-page'a, któremu najpierw nadałam docelowy wygląd spełniając swoją wizję na działanie aplikacji, a następnie połączyłam się z zewnętrznym API i przy jego użyciu wyświetliłam trendy seriali z tego tygodnia.

Wszystkie zmiany odpowiednio zcommitowałam.

Utworzyłam nowy page `SeriesDetailsPage.js`, którego zadaniem jest pokazywanie szczegółów danego serialu (sezonów i odcinków).

Stworzyłam zalogowanego użytkownika, któremu później nadam możliwość edytowania swojej listy seriali.

Utworzyłam bazowego `Dockerfile` do backendu oraz w katalogu głównym projektu a później `docker-compose.yml` również w katalogu głównym projektu jako przygotowanie środowiska deweloperskiego.
Następnie utworzyłam wykluczenia dla korzenia projektu czyli plik `.dockerignore` w głównym katalogu projektu oraz w backendzie. Chroni on przed wgrywaniem ciężkich i niepotrzebnych plików do obrazu.
Podstawowy plik `.dockerignore` w obu miejscach:\
![dockerignore](https://i.postimg.cc/7hRZCs1V/image.png)\
Plik `backend/Dockerfile`:\
![Dockerfile-backend](https://i.postimg.cc/kg171htM/image.png)\
Plik `Dockerfile` dla frontendu:\
![Dockerfile-frontend](https://i.postimg.cc/MGBpFJ28/image.png)\
Plik `docker-compose.yml` w katalpgu głównym projektu:\
![docker-compose](https://i.postimg.cc/L51q2FLX/image.png)

Zrobiłam pierwsze testowe odpalenie kontenerów za pomocą komendy: `docker-compose up --build -d`\
Całość zajęła 72.8s przy pierwszym zbudowaniu.\

![docker-compose-start](https://i.postimg.cc/DwGsQsMx/image.png)\
![docker-compose-up](https://i.postimg.cc/JzjDH8yD/image.png)\

Sprawdziłam stan kontenerów komendą `docker-compose ps`:\
![stan-kontenerow](https://i.postimg.cc/Hx8VHC1f/image.png)\
Widać że uruchomiony jest tylko kontener frontendu a backendu wyłączył się zaraz po starcie.
Żeby to rozwiązać użyłam komendy `docker-compose logs backend` by dowiedzieć się co bylo przyczyną.
Brakowalo zależeności `@supabase/supabase-js` w `package.json`, więc ją zainstalowałam i ponownie uruchomiłam kontenery.
Wystąpił ponownie ten sam błąd więc usunęłam stare kontenery wraz z ich zapisanym stanem wolumenów: `docker-compose down -v`.
Następnie zbudowałam obraz bez użycia cache: `docker-compose build --no-cache`, `docker-compose up -d`.
Przyczyną było ustawienie złej wersji node w `backend/Dockerfile`, po zmianie backend stoi bez zarzutów.


![stan-kontenerow2](https://i.postimg.cc/Pqn0Mgt8/image.png)\
Oba kontenery wstały i chodzą bez zarzutów

Zrzutry ekranu z DockerDesktop:\
![docker-desktop1](https://i.postimg.cc/zff2p89Q/image.png)\
![docker-desktop2](https://i.postimg.cc/FHTDYwYm/image.png)\
![docker-desktop3](https://i.postimg.cc/QdCcyCdp/image.png)\

## FAZA 2

Do testów użyłam Jest. Utworzyłam pliki `server.integration.test.js`, `server.test.js` w backendzie oraz plik `seriesService.test.js` w nowym folderze /src/tests.
Zainstalowałam nowe zależności potrzebne do pracy z testami:

W backendzie:
```
npm install cross-fetch 
npm install ws 
```

cross-fetch - Służy do obsługi klasycznych zapytań HTML, w moim przypadku był konieczny ponieważ środowisko testowe Jest nie miało ich wbudowanych globalnie a cross-fetch dodał brakujące obiekty typu Headers, Request i Response.
WebSocket - Używam do komunikacji w czase rzeczywistym podczas testów integracyjnych. Biblioteka supabase potrzebowała tego importu ponieważ w momencie tworzenia klienta uruchamia się moduł Realtime do nasłuchiwania zdarzeń. Klient supabase wymaga konstruktora websocket nawet jeśli nie używam aplikacji na żywo. W skrócie WebSocket służy do utrzymania połączenia którego supabase wymaga przy starcie.

W głównym katalogu projektu:
```
npm install --save-dev jest supertest axios-mock-adapter 
npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react
npm install --save-dev cross-env  
```
Instalacje te mają na celu dostarczenie środowiska testowego oraz narzędzi wspomagających.

---

jest - używany przeze mnie główny framework do uruchamiania testów\
supertest - biblioteka do testowania punktów końcowych (API HTTP) bez konieczności ręcznego uruchamiania serwera\
axios-mock-adapter - narzędzie do atrapowania (mockowania) zapytań HTTP wykonywanych przez bibliotekę Axios\
babel-jest itd. - pakiet narzędzi do tłumaczenia nowoczesnego kodu JS oraz Reacta(JSX) na wersję rozumiącą przez środowisko Jest\
cross-env - narzędzie gwarantujące poprawne ustawienie zmiennych środowiskowych niezależnie od systemu

Do package.json w głównym katalogu projektu dodałam nowy scripts: `"test": "cross-env NODE_ENV=test jest --coverage --forceExit --detectOpenHandles",` , który ma na celu uruchomienie testów w środowisku testowym z ustawioną zmienną `NODE_ENV=test` przy jednoczesnym generowaniu raportu pokrycia kodu `--coverage`. Flagi `--forceExit` oraz `--detectOpenHandles` wymuszają zakończenie procesu po wykonaniu testów oraz pomagają zidentyfikować niezamknięte połączenia.

### Testy integracyjne backendu z bazą danych Supabase

W celu sprawdzenia poprawności komunikacji pomiędzy backendem aplikacji a bazą danych Supabase przygotowałam zestaw testów integracyjnych.
Głównym celem testów jest sprawdzenie, czy poszczególne endpointy backendu prawidłowo wykonują operacje na rzeczywistej bazie danych oraz czy aplikacja odpowiednio reaguje zarówno na poprawne żądania, jak i sytuacje błędne, np. próbę ponownego dodania tego samego serialu.

Na początku Middleware odpowiedzialny za weryfikację tokenu został zamockowany. Do żądania wstrzykiwany jest użytkownik posiadający UUID konta utworzonego w bazie specjalnie na potrzeby testów. Pozwala to testować endpointy wymagające autoryzacji bez konieczności każdorazowego wykonywania pełnego procesu logowania i uzyskiwania tokenu. Jest to potrzebne ze względu na limity ustawione przez Supabase.
```
jest.mock("./authMiddleware.js", () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: "6f9b63f9-a304-4ed0-ba78-04b7e3acd326" };
        next();
    }
}));
```

Czas do wykonania się zapytania został ustawiony na 10 sekund w umożliwienia przeprowadzenia testów nawet jeśli połączenie byłoby słabe: `jest.setTimeout(10000);`.\
Do testów wykorzystałam specjalnie przygotowane ID serialu 999999. Podane id serialu jest fałszywe, prawdopodobnie nie istniejące w api dlatego, żeby przetestować jedynie możliwość dodania serialu do planowanych oraz w celu sprawdzenia czy backend rozpoznaje próbę dodania duplikatu i usunięcie wpisu z bazy.
```
describe("Testy Integracyjne: Express <-> Supabase", () => {
    const testSeriesId = 999999;
```
---

W pliku `server.integration.test.js` są 3 następujące testy:

Weryfikacja poprawnego dodania nowego serialu:
```
test("1. POST /api/user-series - zapis dodanego serialu", async () => {
        const res = await request(app)
            .post("/api/user-series")
            .send({ seriesId: testSeriesId, status: "Planowane" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Serial pomyłśnie dodany do listy");
    });
```

Sprawdzanie duplikatów w bazie:
```
test("2. POST /api/user-series - blokowanie duplikatu", async () => {
        const res = await request(app)
            .post("/api/user-series")
            .send({ seriesId: testSeriesId });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Ten serial już znajjduje się na twjej liście");
    });
```

Usunięcie serialu z listy:
```
test("3. DELETE /api/user-series/:seriesId - fizyczne usunięcie", async () => {
        const res = await request(app).delete(`/api/user-series/${testSeriesId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Serial usunięty z listy.");
    });
```
Po wykonaniu testu zastosowany na początku pliku blok afterAll odpowiada za usunięcie z bazy testowych wpisów powiązanych z ID podanego wyżej uzytkownika. Takie rozwiazanie pozwala na utrzymanie czystości bazy.
```
afterAll(async () => {
        await supabase
            .from("user_series")
            .delete()
            .eq("user_id", "6f9b63f9-a304-4ed0-ba78-04b7e3acd326");
    });
```

---

### Testy jednostkowe w backendzie

Utworzyłam nowy plik - interpreter JS na język Jesta `babel.config.json` oraz uzupełniłam go o następujące linijki:
```
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Babel preset-env odpowiada za tłumaczenie najnowszych funkcji JS na wersję dopasowaną do wersji NodeJS którą aktualnie posiadamy.

Babel preset-react tłumaczy składnię JSX, czyli używanie znaczników typu div wewnątrz pliku JS.
Konieczne było użycie Babela dlatego, że Jest domyślnie jest ukierunkowany na starszy standard exportów czyli require. Bez babela testy zawieszały się z błędem.

---

Identycznie jak przy testach integracyjnych test jednostkowy oraz testy endpointów rozpoczynam od oszukania autoryzacji, wprowadzam fałszywego użytkownika, symulując status jako zalogowany użytkownik w pliku `server.test.js`.
```
jest.mock("./authMiddleware.js", () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: "test-user-id" };
        next();
    }
}));

jest.mock("axios");
jest.mock("./subabaseClient.js", () => {
    const chainable = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
    };
    return { supabase: chainable };
});
```

Zastosowane zostało tutaj odcięcie zewnętrznego API w celu poprawienia wydajności testów. Nie wysyłam prawdziwych zapytań tylko używam mocka na bibliotece axios do pobierania np. detali serialu z TMDB.
Żeby uniknąć problemów z połączeniem do bazy, klient supabase został podmieniony na fikcyjnego użytkownika, dzięki temu mock omijał całe połączenie i zwracał ustalony wynik.

Dzięki takiemu rozwiązaniu zyskuję korzyści w postaci:
Możliwość szybkiego testowania: prawdziwe zapytanie do bazy albo API trwa zdecydowanie dłużej, zwłaszcza przy kiepskim połączeniu.
W przypadku kiedy serwer TMDB miałby awarię lub nie byłoby połączenia internetowego prawdziwe zapytanie skończyłoby się błędem, mimo, że kod byłby napisany poprawnie. Takie rozwiązanie daje więcej kontroli nad prowadzeniem testów.

---

Testy endpointów PUBLICZNYCH sprawdzają poprawne działanie ścieżek pobierających szczegóły seriali oraz sezonów z zewnętrznego api.
```
test("GET /api/series/:id", async () => {
        axios.get.mockResolvedValueOnce({ data: { name: "Test" } });
        const res = await request(app).get("/api/series/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Test");
    });

test("GET /api/series/:id błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error"));
        const res = await request(app).get("/api/series/1");
        expect(res.statusCode).toBe(500);
    });

test("GET /api/series/:id/season/:seasonNumber", async () => {
        axios.get.mockResolvedValueOnce({ data: { episodes: [] } });
        const res = await request(app).get("/api/series/1/season/1");
        expect(res.statusCode).toBe(200);
    });
```

Testy endpointów chronionych weryfikuja operacje na liście seriali uzytkownika, takie jak dodawanie, kontrolę duplikatów, czy aktualizację postępu w oglądaniu.
```
test("POST /api/user-series sukces", async () => {
        supabase.insert.mockResolvedValueOnce({ data: null, error: null });
        const res = await request(app).post("/api/user-series").send({ seriesId: 1 });
        expect(res.statusCode).toBe(201);
    });

test("POST /api/user-series błąd duplikatu", async () => {
        supabase.insert.mockResolvedValueOnce({ data: null, error: { code: '23505' } });
        const res = await request(app).post("/api/user-series").send({ seriesId: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("już znajjduje się");
    });
```

### Testy w frontendzie

W pliku `seriesService.test.js` znajdują się testy jednostkowe jak i serwisowe dla logiki odpowiedzialnej za obsługę seriali.
Jak w przypadku poprzednich testów zastosowałam mock dla biblioteki axios oraz autoryzacji supabase. W sprawozdaniu pokażę przykładowe:

Sprawdzone zostały funkcje pobierające trendy oglądalności oraz szczegóły dotyczące seriali. Dla każdego pobieranego przypadku testowany jest zarówno sukces jak i błąd.
```
test("getTrending sukces", async () => {
        axios.get.mockResolvedValueOnce({ data: [1, 2] });
        const res = await getTrending();
        expect(res).toEqual([1, 2]);
    });

test("getTrending błąd", async () => {
        axios.get.mockRejectedValueOnce(new Error("Network Error"));
        const res = await getTrending();
        expect(res).toEqual([]);
    });
```

Testy operacji użytkownika zalogowaneego są to funkcje służące do zarządzania listą seriali. 
```
test("getUserSeries sukces", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

        const res = await getUserSeries();
        expect(res.length).toBe(1);
    });

test("getUserSeries błąd", async () => {
        supabase.auth.getSession.mockResolvedValueOnce({ data: { session: mockSession } });
        axios.get.mockRejectedValueOnce(new Error("Error"));

        const res = await getUserSeries();
        expect(res).toEqual([]);
    });
```

### Pokrycie testami

Po odpaleniu komendy `npm test` mogę sprawdzić aktualne pokrycie kodu testami. 
W moim przypadku wynosi ono:

![pokrycie-testami](https://i.postimg.cc/sXDQB6Q0/image.png)

### Dokumentacja API

W folderze `documentation` utworzylam nowy plik `api-documentation` mający na celu dokumentację listy endpointów w markdowni'e.

## FAZA 3

Zaczęłam od poprawy jednej rzeczy, frontend nie powinien znać adresu backendu.
W tym celu otwotzyłam plik `src/services/seriesService.js` i zmieniłam **API_URL** tak by frontend sztywno nie wiedział, że backend siedzi na `localhost:3000`.
Po zmianie React będzie po prostu wysyłał `api/trending`, nie będzie obchodzić go gdzie znajduje się backend.
Dockerfile już był zoptymalizowany pod kątem obrazu ze względu na ustawienie wcześniej `node:22-alpine`.

Kolejno przeszlam do pliku `Dockerfile` w backendzie, gdzie zmieniłam `RUN npm install` na `RUN npm ci`.
Między `COPY` a `EXPOSE` dodałam:
```
ENV NODE_ENV=production
ENV PORT=3000
```
a po `EXPOSE` dodałam:
```
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
```

Docker co 30 sekund odpytuje `http://localhost:3000/api/health` z backendu, ponieważ w `server.js` mam już healthchecka:
```
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'SERWER DZIAŁA!'
    });
});
```
Czyli healthcheck sprawdza rzeczywiste działanie Expressa, a nie tylko to, czy proces Node istnieje.

Następnie zdecydowałam się powiększyć `.dockerignore` by nie wysylać ogromnych i niechcianych plików do obrazu.
Dodałam: 
```
build
coverage
.github
.env.local
.env.development
.env.production
.env.test
yarn-debug.log*
yarn-error.log*
documentation
```

Potem tak samo rozszerzylam `.dockerignore` w backendzie.
Następnie rozszerzyłam plik `docker-compose.yml`:
```
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile

    ports:
      - "3000:3000"

    env_file:
      - ./backend/.env

    environment:
      PORT: 3000
      NODE_ENV: production

    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://localhost:3000/api/health"
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

    networks:
      - seriestracker-network

    restart: unless-stopped


  frontend:
    build:
      context: .
      dockerfile: Dockerfile

    ports:
      - "5000:5000"

    env_file:
      - ./.env

    environment:
      PORT: 5000
      CHOKIDAR_USEPOLLING: "true"
      WATCHPACK_POLLING: "true"

    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://127.0.0.1:5000"
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s

    depends_on:
      backend:
        condition: service_healthy

    networks:
      - seriestracker-network

    restart: unless-stopped

    stdin_open: true
    tty: true


networks:
  seriestracker-network:
    driver: bridge
```

Mam 2 services: frontend i backend, ze względu na to że bazę danych mam dzięki Supabase.
Usługi dostaly swoje nazwy, dzięki którym później Docker może rozwiązać nazwę usługi na adres IP odpowiedniego kontenera.
Dzięki `env_file: ./backend/.env` nie wpisuję wrażliwych danych do kodu publicznego.
Dzięki `NODE_ENV: production` informuje Node, że uruchamiam aplikację jako środowisko produkcyjne/kontenerowe a nie testowe.
Zdefiniowałam odpowiednie healthchecki. Co 30 sekund sprawdza, jeżeli odpowiedź trwa ponad 5 sekund, to uznaje próbę za nieudaną, pozwala na 3 nieudane próby zanim oznaczy kontener jako `unhealthy`, daje backendowi 10 sekund na normalne uruchomienie się.
Healthcheck frontendu używał localhost, który wewnątrz kontenera został rozpoznany jako adres IPv6 ::1, a React na nim nie odpowiadał. Dlatego zmieniam go na 127.0.0.1, czyli jawny adres IPv4 wskazujący na ten sam kontener. Dzięki temu Docker może poprawnie sprawdzić, czy frontend rzeczywiście działa na porcie 5000, i oznaczyć go jako healthy.
Dodałam też `restart: unless-stopped`, czyli jak kontener padnie, Docker może go ponownie uruchomić, chyba że sama świadomie go zatrzymałam, co zwiększa odporność usługi.

Podłączyłam backend do mojej sieci, którą zdefiniowałam na dole. `bridge` tworzy prywatną wirtualną sieć pomiędzy kontenerami.
Poprawność komunikacji potwierdziłam, wykonując z kontenera frontend żądanie do http://backend:3000/api/health za pomocą komendy `docker compose exec frontend wget -qO- http://backend:3000/api/health`.
W odpowiedzi dostałam `{"status":"ok","message":"SERWER DZIAŁA!"}`, co udowadnia, że komunikacja po nazwach usług działa.\
![komunikacja-kontenerow](https://i.postimg.cc/RhRBDH7f/image.png)\


We frontendzie dałam solidną poprawkę. Poprawiłam 
```
depends_on:
  - backend
```
na:
```
depends_on:
  backend:
    condition: service_healthy
```
Poprawia to orkiestrację i wylucza możliwosć, że Node mógł być jeszcze nie gotowy.

Oba kontenery wstają ze statusem `healthy` z zoptymalizowanym obrazem, a kontenery komunikują się ze sobą za pomocą nazw usług.

## FAZA 4

Wybrałam uklad 
> PR -> CI -> merge do `main` -> CI -> CD -> Render

Nie chcę robić deploya na każdy zwykły push z dowolnej galęzi, bo można przypadkiem wrzucić syf na produkcję.
Do `package.json` w głównym katalogu projektu dodalam linijkę `"lint": "eslint src backend --ext .js,.jsx",` między test a eject. Statycznej analizie podlega kod źródłowy zarówno części frontendowej React, jak i backendowej Express. Docelowo ten workflow będzie odpowiadać za: CI - sprawdzenie aplikacji, CD - wdrożenie aplikacji.
wykonalam komendę `npm run lint` by sprawdzić błędy jakie może wykryć i je poprawiłam.
wykonałam komendę `npm run build` by sprawdzić czy aplikacja bez problemu się zbuduje.
wykonałam komendę `npm test` by sprawdzić czy testy przechodzą pomyślnie. 

Następnie w katalogu glównym projektu utworzyłam nowy katalog `.github/workflows/` a w nim plik `ci-cd.yml`.
Uzupełniłam plik o treść:
```
name: SeriesTracker CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  ci:
    name: CI - Lint, Test and Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run tests with coverage
        run: npm test

      - name: Build application
        run: npm run build
```
CI uruchomi się w momencie Pull Requesta na gałąź `main`. Dzięki temu sprawdzam kod przed połączeniem go. Push oznacza, że jeżeli nowy kod znajdzie się na `main`, to uruchom workflow ponownie.
Kolejno zajęłam się konfiguracją Github Secrets, w którym przechowuję dane wrażliwe takie jak SUPABASE_URL itd. Wcześniej miałam przerwany czerwony potok, ponieważ zapomnialam, że jeden test korzysta z danych z `.env`. Bezwłocznie się tym zajęłam aby później móc sprawdzić czy potok CI przechodzi na zielono.

Na gihtubie w moim repozytorium projektu weszłam kolejno do **Settings** -> **Secrets and variables** -> **Actions**, w sekcji **Repository secrets** kliknęłam **New repository secret**, następnie w okienkach uzupełniłam wrażliwe dane. Później będę dodawać tam również private URL Deploy Hook'a.\
![Github Secrets](https://i.postimg.cc/HkzBk3yV/image.png)

Teraz w moim `workflows/ci-cd` w sekcji testów między name a run dodalam:
```
- name: Run tests with coverage
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_KEY: ${{ secrets.BACKEND_SUPABASE_KEY }}
  run: npm test
```
ponieważ, mój test potrzebuje klucza z backendu.
Po zmianie odpaliłam jeszcze lokalnie testy i lint.
Następnie zrobiłam pusha do mojego pull requesta by zobaczyć czy CI ma już zielony potok.
![CI potok](https://i.postimg.cc/q7XhTZhs/image.png)\

Kolejno przygotowałam się do dodania kolejnego joba do mojego workflow. Zalogowalam się na Rendera. Na Renderze wykonalam kolejno kroki:
* Kliknęlam kafelek **Create new project**
* Wpisałam nazwę **SeriesTracker**\
![Render](https://i.postimg.cc/Fz45yDsS/image.png)

Potem przeszlam do konfiguracji usługi backendu.
* Kliknęlam w **Create new service**
* Wybrałam **New web service** w sekcji **Web Services**
Dlatego, że mam backend, czyli proces serwerowy, który musi działać cały czas i obslugiwać endpointy API.
* Wybralam repozytorium mojego projektu
* W sekcji Advanced dalam **Auto-Deploy** na Off
* Nadałam nazwę `seriestracker-backend`
* Zmienilam **Root Directory** na `backend/`
* W **Docker Build Context Directory** dalam `backend/ .`
* W **Dockerfile Path** dalam `backend/Dockerfile`
* W **Health Check Path** dałam `/api/health`
* Dodalam do **Environment Variables** moje wrażliwe dane: TMDB, SUPABASE_KEY, SUPABASE_URL
![Render-dane](https://i.postimg.cc/cL01y7Ym/image.png)\
* Kliknęłam **Deploy web service**\
![Render-backend/deploy](https://i.postimg.cc/C5stj8Km/image.png)\
Oczywiście jeszcze nie ma najnowszego pull requesta, ponieważ nie został on zmergowany a workflow jeszcze nie obsłuje CD.\
![Render-backend/deploy/api/health](https://i.postimg.cc/vBLXjsdB/image.png)

Następnie przeszlam do konfiguracji usługi frontendu.
* Kliknęlam w **Create new service**
* Wybrałam **New static site** ponieważ to dla Reacta lepsze i prostsze rozwiązanie, Render ma osobną konfigurację dla `Create React App: build npm run build`
* Wybralam repozytorium mojego projektu
* Nadałam nazwę `seriestracker-frontend`
* Dodalam do **Publish Directory** `build`
* Dodalam do **Environment Variables** moje wrażliwe dane: SUPABASE_URL, SUPABASE_KEY, REACT_APP_API_URL
* Dalam **Auto-Deploy** na Off
* Kliknęłam **Deploy Static Site**\
![Render-static-site](https://i.postimg.cc/Px0LHLzC/image.png)\
![Production](https://i.postimg.cc/8C5srdZy/image.png)

Kolejno przeszlam do konfiguracji Deploy-Hook'a. W Renderze kliknęlam swój frontend a potem **Settings**, gdzie przeszłam do sekcji **Deploy**. Tam skopiowałam swój prywatny adres URL Deply-Hook'a. 
Ponownie na Githubie w swoim repozytorium dodałam nowy sekret, w którym znajduje się adres Deploy-Hook'a.\
![deployhokfrontend](https://i.postimg.cc/CLp2LS7S/image.png)\
Tak samo zrobiłam z backendem.\
![deplouhookbackend](https://i.postimg.cc/BQcJJhxP/image.png)

Wróciłam teraz do pliku `.github/workflows/ci-cd.yml` i w nim dodałam joba cd:
```
cd:
    name: CD - Deploy to Render
    runs-on: ubuntu-latest
    needs: ci
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - name: Deploy backend to Render
        run: curl -fsS -X POST "${{ secrets.RENDER_BACKEND_DEPLOY_HOOK }}"

      - name: Deploy frontend to Render
        run: curl -fsS -X POST "${{ secrets.RENDER_FRONTEND_DEPLOY_HOOK }}"
```

Job deploy posiada zależność `needs: ci`, dlatego nie może zostać wykonany, jeżeli etap Continuous Integration zakończy się niepowodzeniem.