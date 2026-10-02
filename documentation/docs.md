# Sprawozdanie z projektu SeriesTracker

---

**Temat:** Zintegrowany system do zarządzania osobistą listą seriali, pozwalający śledzić postęp oglądania
### Dane autora: 
+ **Imię i nazwisko:** [Małgorzata Andrzejewska]
+ **Kierunek:** [Informatyka]
+ **Grupa:** [235IC A2]
+ **Link do repo na github:** https://github.com/kyiooo/

---

### FAZA 1 Inicjalizacja projektu oraz konfiguracja środowiska

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

### FAZA 1,5 Tworzenie aplikacji

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

