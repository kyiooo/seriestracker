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

Kolejnym etapem było zbudowanie przeze mnie aplikacji, na początku utworzyłam nowy branch `feature/login-page` oraz w następnych etapach `feature/register-page`. W obu przypadkach najpierw zajęłam się ui a potem będę commitować do tych feature'ow backend.

Następnie utworzyłam server łączący moją aplikację z bazą danych SupaBase. Pozwoli to mi na ukrycie "secret key", który bezpośrednio łączy moją aplikację z bazą.