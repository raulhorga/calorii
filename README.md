# Calorie Compass

Aplicație web statică pentru urmărirea caloriilor și a valorilor nutriționale, cu sincronizare prin EtherCalc.

## EtherCalc

- Jurnal zilnic: `https://ethercalc.net/=5pnc2i51phgo`
- Bază de alimente: `https://ethercalc.net/=yve145gi1nxa`
- Țintă calorică zilnică: **1800 kcal**

## Funcții principale

- calendar pentru selectarea zilei;
- jurnal zilnic pentru Mic dejun, Prânz, Cină și Gustare;
- adăugare, editare și ștergere înregistrări;
- sincronizare cu EtherCalc;
- grafic caloric;
- export lunar în Excel;
- bază de alimente editabilă;
- import masiv de alimente din CSV;
- interfață responsive.

## Valori nutriționale

Pentru fiecare aliment sunt urmărite, per 100 g:

- calorii;
- grăsimi;
- carbohidrați;
- proteine;
- fibre;
- zahăr.

Aplicația calculează automat valorile pentru cantitatea consumată.

## Rezumat nutrițional zilnic

În partea de sus sunt afișate totalurile zilnice pentru:

- calorii;
- grăsimi;
- carbohidrați;
- proteine;
- fibre;
- zahăr total.

Reperele generale folosite pentru o țintă de 1800 kcal sunt:

- grăsimi: aproximativ **30–60 g/zi**;
- carbohidrați: aproximativ **203–338 g/zi**;
- proteine: aproximativ **45–68 g/zi**;
- fibre: minimum **25 g/zi**;
- zahăr liber: sub aproximativ **45 g/zi**, ideal sub aproximativ **23 g/zi**.

Notă: aplicația urmărește zahărul total. Limita WHO este pentru zahăr liber.

## Căutare aliment în jurnal

În fereastra **„Adaugă aliment”** există câmpul **„Caută aliment”**.

Pe măsură ce tastezi:

1. lista de alimente este filtrată instantaneu;
2. selectezi alimentul dorit;
3. introduci cantitatea;
4. aplicația calculează automat caloriile și nutrienții;
5. înregistrarea este salvată în jurnalul EtherCalc.

## Import masiv al bazei de alimente

Butonul **„Importă CSV”** permite încărcarea în masă a alimentelor.

Structura recomandată:

```text
id,name,kcal_per_100g,fat_per_100g,carbs_per_100g,protein_per_100g,fiber_per_100g,sugar_per_100g,category,updated_at
```

Alimentele noi sunt adăugate, iar cele existente cu aceeași denumire sunt actualizate.

## Export lunar Excel

Exportul lunar creează un fișier `.xlsx` cu:

- foaie de detaliu;
- rezumat zilnic;
- calorii;
- grăsimi;
- carbohidrați;
- proteine;
- fibre;
- zahăr;
- comparație cu ținta calorică.

## Sincronizare și date

Jurnalul folosește foaia EtherCalc:

`5pnc2i51phgo`

Aplicația normalizează datele venite din EtherCalc pentru ca aceeași zi să fie recunoscută corect indiferent de formatul întors de spreadsheet.

Timezone aplicație:

`Europe/Bucharest`

## Istoric update-uri

### v7
- import masiv CSV pentru baza de alimente;
- bază extinsă cu calorii și macronutrienți.

### v12
- jurnal mutat pe noua foaie EtherCalc `5pnc2i51phgo`.

### v13
- corectarea formatelor de dată venite din EtherCalc;
- jurnalul zilnic rămâne vizibil după sincronizare.

### v14
- rezumat nutrițional în partea de sus;
- afișare grăsimi, carbohidrați, proteine, fibre și zahăr;
- repere generale zilnice raportate la 1800 kcal.

### v15
- câmp de căutare în dialogul „Adaugă aliment”;
- filtrare live a listei de alimente;
- focus automat pe căutare când se deschide dialogul.

## Publicare pe GitHub Pages

Redenumește fișierele:

- `calorie_compass_v15_food_search_index.html.txt` → `index.html`
- `calorie_compass_v15_food_search_styles.css.txt` → `styles.css`
- `calorie_compass_v15_food_search_app.js.txt` → `app.js`
- `calorie_compass_v15_README.md.txt` → `README.md`

Apoi înlocuiește fișierele din repository și publică prin GitHub Pages.


### v16
- corectare eroare UI `Cannot set properties of undefined (setting 'textContent')`;
- adăugată referința DOM lipsă pentru `targetPercent`;
- fără modificări la sincronizarea EtherCalc sau la logica jurnalului.
