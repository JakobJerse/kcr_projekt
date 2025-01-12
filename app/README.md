# :tv: Raziskava uporabniških vmesnikov slovenskih televizijskih operaterjev in zasnova univerzalnega televizijskega vmesnika

### Projekt pri predmetu **Komunikacija človek-računalnik**

#### Skupina 17

---

### :dart: Cilj projekta:

Glavni cilj projekta je bil raziskati uporabniške vmesnike štirih glavnih slovenskih televizijskih operaterjev: Telekom Slovenije, Telemach, A1 in T-2. Osredotočili smo se na to, kako uporabniki ocenjujejo posamezne vmesnike, kaj jim je všeč, kaj jih moti, ter kako intuitivna in enostavna je uporaba teh vmesnikov. Na podlagi ugotovitev smo zasnovali univerzalni televizijski vmesnik, ki odpravlja največje pomanjkljivosti in ohranja najboljše lastnosti. Odzive na zasnovani vmesnik smo pridobili s pomočjo intervjujev v živo, ter rezultate podali v končnem poročilu, ki se prav tako nahaja v tem repozitoriju.

---

### :computer: Vzpostavitev lokalnega okolja

V kolikor želi uporabnik sam preizkusiti vmesnik, si mora vsebino tega repozitorija prenesti na svoj računalnik, ter iz direktorija, kamor je vsebino prenesel v ukazni vrstici izvesti naslednje ukaze:

`$ python -m venv myvenv`

`$ source ./myvenv/bin/activate`

`$ pip install -r requirements.txt`

Za zagon aplikcije pa je potrebno izvesti naslednji ukaz:

`$ python app.py`

Stran bi sedaj morala biti dostopna na naslovu [localhost:8080](http://127.0.0.1:8080).

(zgornji ukazi predpostavljajo, da ima uporabnik že naložen python)

---

### :exclamation: Navigiranje po vmesniku

Po celotnem vmesniku se luporabnik ahko premika z miško. Ker pa tv vmesnike seveda upravljamo z daljinjci, smo implementirali tudi navigacijo z dalinjcem, ki pa zaradi potrebe demonstracije deluje samo na _domači strani vmesnika, modalnih oknih predogleda vsebine in samem predvajalniku vsebine_. Na strani straneh _filmi_ in _serije_ navigacija z daljincem ne deluje.

Do daljica lahko uporabnik dostopa na [localhost:8080/remote](localhost:8080/remote) - priporočamo, da si ga uporabnik odpre v ločenem oknu brskalnika, saj bo tako lažje navigiral po vmesniku.

> Za najboljšo izkušnjo pa lahko uporabnik stran z daljincem odpre na svojem telefonu ob predpostavki da računalnik, na katerem uporabnik testira vmesnik in telefon uporabljata **isto omrežje**.

##### Uporaba daljinca v video predvajalniku

Daljinec ima največjo vlogo v video predvajalniku. Podpira naslednje akcije:

- S puščicami :arrow_backward: :arrow_up_small: :arrow_forward: :arrow_down_small: se uporabnik navigira po elementih, ki jih je mogoče pritisniti
- Z gumbom :ok: pritisne na trentno izbran element in izvede akcijo
- Z gumbi: Vol-, :mute:, Vol+ upravlja z glasnostjo
- Z gumbi :rewind:, :arrow_forward:, :fast_forward: se lahko premika po časovnici predvajane vsebine. Tu ima uporabnik več možnosti:
  - če pritisne gumb :fast_forward: 1x se za fiksen interval premakne po vsebini naprej. Enaka logika velja za gumb :rewind:
  - če pritisne na gumb :fast_forward: 1x in ga drži, se po vsebini naprej premika s prvo hitrostjo, če ga pritisne 2x in drži, se po vsebini naprej premika z višjo hitrostjo in če ga pritisne 3x, se po vsebini naprej premika z najvišjo hitrostjo. Enaka logika velja za gumb :rewind:.
- Z gumbom ⚙️: uporabnik preide na stran nastavitev
- Z gumbom :house: se uporabnik vrne na domačo stran vmesnika
- Gumb ⚡: Predstavlja programabilen gumb, ki si ga uporabnik nastavi, da izvede poljubno akcijo (ni implementirano)
- Z gumbom :leftwards_arrow_with_hook: se uporabnik vrne en korak nazaj
- Z gumbom :microphone: uporabnik omogoči glasnovno upravljanje oz. iskanje
- Z gumbom :mag: uporabnik pride na stran iskalnika po vsebinah

TODO - rozl verjetno sem kej pozabu alpa narobe napisu
