# Calorie Compass — tracker de calorii cu EtherCalc

Aplicație statică HTML/CSS/JS pentru urmărirea caloriilor zilnice, construită pornind de la mecanismul de sincronizare EtherCalc din proiectul inițial.

## Surse EtherCalc

- **Jurnal calorii:** https://ethercalc.net/=5ybwphczduwg
- **Mapare alimente:** https://ethercalc.net/=yve145gi1nxa

Aplicația citește CSV din EtherCalc și salvează modificările prin `PUT` către foaia corespunzătoare.

## Funcții

- calendar lunar pentru alegerea zilei;
- jurnal pe mese: Mic dejun, Prânz, Cină, Gustare;
- selectare aliment + cantitate în grame;
- calcul automat `kcal = kcal/100g × grame / 100`;
- țintă zilnică fixată la **1800 kcal**;
- indicator vizual pentru zilele în obiectiv și zilele cu depășire;
- grafic pentru ultimele 14 zile, cu linie de țintă la 1800 kcal;
- medie calorică pe ultimele 7 zile;
- bază de alimente editabilă direct din aplicație;
- salvare automată a mapării alimentelor în EtherCalc;
- listă implicită de alimente creată automat dacă foaia de mapare este goală;
- sincronizare automată la 15 secunde, la revenirea în tab și la reconectarea la internet;
- layout responsive pentru desktop și mobil.

## Format jurnal calorii

Coloane:

`id,date,meal,food_id,food_name,grams,kcal,note,updated_at`

## Format mapare alimente

Coloane:

`id,name,kcal_per_100g,category,updated_at`

## Lista implicită

Include alimente uzuale precum orez, paste, pâine, ovăz, cartofi, pui, curcan, vită, somon, ton, ou, lactate, fructe, legume, nuci, ulei de măsline, ciocolată, înghețată și pizza.

Valorile calorice sunt valori orientative per 100 g și pot fi editate oricând din interfață. Pentru etichete nutriționale exacte, actualizează valorile conform produsului consumat.

## Publicare

Pune `index.html`, `styles.css`, `app.js` și `README.md` în același repository și publică prin GitHub Pages sau orice hosting static.

## Notă despre EtherCalc

EtherCalc este convenabil pentru un proiect personal, dar foile publice nu sunt potrivite pentru informații sensibile. Nu stoca date medicale sau alte date private în aceste foi.
