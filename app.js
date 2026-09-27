'use strict';

const TARGET = 1800;
const LOG_ROOM = '5ybwphczduwg';
const FOOD_ROOM = 'yve145gi1nxa';
const ETHERCALC = 'https://ethercalc.net';
const SYNC_MS = 15000;
const MEAL_SHADOW_KEY='calorie_compass_meals_v6';
const MEAL_DELETED_KEY='calorie_compass_deleted_meals_v6';
const MEAL_ORDER = ['Mic dejun','Prânz','Cină','Gustare'];
const DEFAULT_FOODS = [
  ['Orez fiert',130,0.3,28.2,2.7,0.4,0.1,'Cereale'],
  ['Paste fierte',158,0.9,30.9,5.8,1.8,0.6,'Cereale'],
  ['Pâine integrală',247,4.2,41.2,13.0,6.8,5.0,'Panificație'],
  ['Fulgi de ovăz',379,6.5,67.7,13.2,10.1,1.0,'Cereale'],
  ['Cartofi fierți',87,0.1,20.1,1.9,1.8,0.9,'Legume'],
  ['Cartofi copți',93,0.1,21.2,2.5,2.2,1.2,'Legume'],
  ['Cartofi prăjiți',312,15.0,41.4,3.4,3.8,0.3,'Fast food'],
  ['Mămăligă',70,0.4,15.0,1.5,1.0,0.2,'Cereale'],
  ['Piept de pui gătit',165,3.6,0.0,31.0,0.0,0.0,'Carne'],
  ['Pulpă de pui gătită',209,10.9,0.0,26.0,0.0,0.0,'Carne'],
  ['Curcan gătit',135,1.8,0.0,29.0,0.0,0.0,'Carne'],
  ['Vită slabă gătită',217,8.0,0.0,34.0,0.0,0.0,'Carne'],
  ['Somon gătit',206,12.4,0.0,22.1,0.0,0.0,'Pește'],
  ['Ton în suc propriu',116,0.8,0.0,25.5,0.0,0.0,'Pește'],
  ['Ou fiert',155,10.6,1.1,12.6,0.0,1.1,'Ouă'],
  ['Șuncă',145,5.5,1.5,21.0,0.0,1.0,'Carne'],
  ['Lapte 1.5%',46,1.5,4.8,3.4,0.0,4.8,'Lactate'],
  ['Iaurt grecesc 2%',73,2.0,3.9,10.0,0.0,3.9,'Lactate'],
  ['Brânză telemea',280,22.0,2.0,17.0,0.0,1.0,'Lactate'],
  ['Cașcaval',356,27.0,2.2,25.0,0.0,0.5,'Lactate'],
  ['Măr',52,0.2,13.8,0.3,2.4,10.4,'Fructe'],
  ['Banană',89,0.3,22.8,1.1,2.6,12.2,'Fructe'],
  ['Portocală',47,0.1,11.8,0.9,2.4,9.4,'Fructe'],
  ['Căpșuni',32,0.3,7.7,0.7,2.0,4.9,'Fructe'],
  ['Afine',57,0.3,14.5,0.7,2.4,10.0,'Fructe'],
  ['Roșii',18,0.2,3.9,0.9,1.2,2.6,'Legume'],
  ['Castraveți',15,0.1,3.6,0.7,0.5,1.7,'Legume'],
  ['Ardei gras',31,0.3,6.0,1.0,2.1,4.2,'Legume'],
  ['Broccoli',34,0.4,6.6,2.8,2.6,1.7,'Legume'],
  ['Morcov',41,0.2,9.6,0.9,2.8,4.7,'Legume'],
  ['Avocado',160,14.7,8.5,2.0,6.7,0.7,'Fructe'],
  ['Nuci',654,65.2,13.7,15.2,6.7,2.6,'Nuci și semințe'],
  ['Migdale',579,49.9,21.6,21.2,12.5,4.4,'Nuci și semințe'],
  ['Unt de arahide',588,50.4,20.0,25.1,6.0,9.2,'Nuci și semințe'],
  ['Ulei de măsline',884,100.0,0.0,0.0,0.0,0.0,'Grăsimi'],
  ['Ciocolată neagră',598,42.6,45.9,7.8,10.9,24.0,'Dulciuri'],
  ['Înghețată',207,11.0,23.6,3.5,0.7,21.2,'Dulciuri'],
  ['Pizza',266,10.0,33.0,11.0,2.3,3.6,'Fast food']
];
const DEFAULT_FOOD_NUTRITION = new Map(DEFAULT_FOODS.map(([name,kcal100,fat100,carbs100,protein100,fiber100,sugar100,category])=>[name,{kcal100,fat100,carbs100,protein100,fiber100,sugar100,category}]));

const state = {
  meals: [],
  foods: [],
  selectedDate: todayISO(),
  calendarMonth: new Date(),
  syncing: false,
  savingMeals: false,
  savingFoods: false,
  lastMealSaveAt: 0,
  lastFoodSaveAt: 0,
  deletedMealIds: new Set(),
  showAllFoods: false
};
const $ = s => document.querySelector(s);
const el = {
  syncStatus:$('#syncStatus'), syncButton:$('#syncButton'), selectedDateLabel:$('#selectedDateLabel'), datePicker:$('#datePicker'), openDatePicker:$('#openDatePicker'), prevDay:$('#prevDay'), nextDay:$('#nextDay'),
  dailyCalories:$('#dailyCalories'), targetRing:$('#targetRing'), dayStatus:$('#dayStatus'), remainingText:$('#remainingText'), metricCalories:$('#metricCalories'), metricItems:$('#metricItems'), metricMeal:$('#metricMeal'), metricMealSub:$('#metricMealSub'), metricAverage:$('#metricAverage'),
  calendarTitle:$('#calendarTitle'), calendarGrid:$('#calendarGrid'), prevMonth:$('#prevMonth'), nextMonth:$('#nextMonth'), todayButton:$('#todayButton'), exportMonthExcel:$('#exportMonthExcel'), chart:$('#calorieChart'), mealGroups:$('#mealGroups'), emptyDiary:$('#emptyDiary'),
  mealDialog:$('#mealDialog'), mealForm:$('#mealForm'), mealId:$('#mealId'), mealFood:$('#mealFood'), mealGrams:$('#mealGrams'), mealType:$('#mealType'), mealNote:$('#mealNote'), mealPreview:$('#mealCaloriesPreview'), mealFatPreview:$('#mealFatPreview'), mealCarbsPreview:$('#mealCarbsPreview'), mealProteinPreview:$('#mealProteinPreview'), mealFiberPreview:$('#mealFiberPreview'), mealSugarPreview:$('#mealSugarPreview'), mealDialogTitle:$('#mealDialogTitle'),
  foodDialog:$('#foodDialog'), foodForm:$('#foodForm'), foodId:$('#foodId'), foodName:$('#foodName'), foodCalories:$('#foodCalories'), foodFat:$('#foodFat'), foodCarbs:$('#foodCarbs'), foodProtein:$('#foodProtein'), foodFiber:$('#foodFiber'), foodSugar:$('#foodSugar'), foodCategory:$('#foodCategory'), foodDialogTitle:$('#foodDialogTitle'), deleteFood:$('#deleteFood'), foodTable:$('#foodTable'), foodSearch:$('#foodSearch'), showAllFoods:$('#showAllFoods'), importFoodsCsv:$('#importFoodsCsv'), foodCsvInput:$('#foodCsvInput'), toast:$('#toast')
};

function todayISO(){const d=new Date();return localISO(d)}
function localISO(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function fromISO(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
function addDays(iso,n){const d=fromISO(iso);d.setDate(d.getDate()+n);return localISO(d)}
function fmtDate(iso){const d=fromISO(iso);const today=todayISO();if(iso===today)return `Astăzi · ${d.toLocaleDateString('ro-RO',{day:'numeric',month:'long'})}`;return d.toLocaleDateString('ro-RO',{weekday:'long',day:'numeric',month:'long',year:d.getFullYear()!==new Date().getFullYear()?'numeric':undefined})}
function setSync(text,type=''){el.syncStatus.textContent=text;el.syncStatus.dataset.type=type}
function csvEscape(v){const s=String(v??'');return /[",\r\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function parseCsv(text){const rows=[];let row=[],field='',q=false;for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'&&text[i+1]==='"'){field+='"';i++}else if(c==='"')q=false;else field+=c}else if(c==='"')q=true;else if(c===','){row.push(field);field=''}else if(c==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field=''}else field+=c}if(field||row.length){row.push(field.replace(/\r$/,''));rows.push(row)}return rows}
function rowsToCsv(rows){return rows.map(r=>r.map(csvEscape).join(',')).join('\n')}
function roomUrl(room,write=false){const safe=encodeURIComponent(room);return write?`${ETHERCALC}/_/${safe}`:`${ETHERCALC}/_/${safe}/csv?t=${Date.now()}`}
async function fetchWithTimeout(url,options={},timeoutMs=15000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{...options,signal:controller.signal,mode:'cors',credentials:'omit'})}
  finally{clearTimeout(timer)}
}
async function getCsv(room){
  const r=await fetchWithTimeout(roomUrl(room),{method:'GET',cache:'no-store',headers:{'Accept':'text/csv'}});
  if(!r.ok)throw new Error(`Citirea EtherCalc a eșuat (${r.status} ${r.statusText||''})`);
  return r.text()
}
async function putCsv(room,csv){
  const r=await fetchWithTimeout(roomUrl(room,true),{
    method:'PUT',
    cache:'no-store',
    headers:{'Content-Type':'text/csv','Accept':'text/plain,text/csv,*/*'},
    body:'\uFEFF'+csv
  },20000);
  const responseText=await r.text().catch(()=> '');
  if(!r.ok)throw new Error(`Scrierea EtherCalc a eșuat (${r.status} ${r.statusText||''})${responseText?`: ${responseText.slice(0,180)}`:''}`);
  return responseText
}
function sameRecord(remote,local){return !!remote&&String(remote.updatedAt||'')===String(local.updatedAt||'')}
async function verifyMealsSaved(expected){
  const csv=await getCsv(LOG_ROOM),remote=parseMeals(csv);
  const missing=expected.filter(x=>!sameRecord(remote.find(r=>r.id===x.id),x));
  if(missing.length)throw new Error(`EtherCalc nu a confirmat ${missing.length} înregistrări din jurnal.`);
  return remote
}
async function verifyFoodsSaved(expected){
  const csv=await getCsv(FOOD_ROOM),remote=parseFoods(csv);
  const missing=expected.filter(x=>!sameRecord(remote.find(r=>r.id===x.id),x));
  if(missing.length)throw new Error(`EtherCalc nu a confirmat ${missing.length} alimente.`);
  return remote
}
async function putAndVerify(room,csv,verifyFn,expected){
  let lastError;
  for(let attempt=1;attempt<=2;attempt++){
    try{
      await putCsv(room,csv);
      await new Promise(resolve=>setTimeout(resolve,350));
      return await verifyFn(expected)
    }catch(err){lastError=err;if(attempt<2)await new Promise(resolve=>setTimeout(resolve,700))}
  }
  throw lastError
}

function headerIndex(header,name){return header.findIndex(x=>String(x||'').trim().toLowerCase()===name)}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function round1(v){return Math.round((Number(v)||0)*10)/10}
function parseFoods(csv){
  const rows=parseCsv(csv).filter(r=>r.some(Boolean));if(!rows.length)return[];
  const header=rows[0].map(x=>String(x||'').trim().toLowerCase());
  const hasHeader=header.includes('id');
  if(!hasHeader){
    return rows.map(r=>{const name=r[1]||'',d=DEFAULT_FOOD_NUTRITION.get(name)||{};return {id:r[0]||crypto.randomUUID(),name,kcal100:num(r[2]),fat100:num(d.fat100),carbs100:num(d.carbs100),protein100:num(d.protein100),fiber100:num(d.fiber100),sugar100:num(d.sugar100),category:r[3]||d.category||'',updatedAt:r[4]||''}}).filter(f=>f.name)
  }
  const ix=n=>headerIndex(header,n);
  return rows.slice(1).map(r=>{
    const name=r[ix('name')]||'',d=DEFAULT_FOOD_NUTRITION.get(name)||{};
    return {
      id:r[ix('id')]||crypto.randomUUID(),name,
      kcal100:num(r[ix('kcal_per_100g')]),
      fat100:ix('fat_per_100g')>=0?num(r[ix('fat_per_100g')]):num(d.fat100),
      carbs100:ix('carbs_per_100g')>=0?num(r[ix('carbs_per_100g')]):num(d.carbs100),
      protein100:ix('protein_per_100g')>=0?num(r[ix('protein_per_100g')]):num(d.protein100),
      fiber100:ix('fiber_per_100g')>=0?num(r[ix('fiber_per_100g')]):num(d.fiber100),
      sugar100:ix('sugar_per_100g')>=0?num(r[ix('sugar_per_100g')]):num(d.sugar100),
      category:ix('category')>=0?(r[ix('category')]||''):(d.category||''),
      updatedAt:ix('updated_at')>=0?(r[ix('updated_at')]||''):''
    }
  }).filter(f=>f.name)
}
function foodsCsv(){return rowsToCsv([['id','name','kcal_per_100g','fat_per_100g','carbs_per_100g','protein_per_100g','fiber_per_100g','sugar_per_100g','category','updated_at'],...state.foods.slice().sort((a,b)=>a.name.localeCompare(b.name,'ro')).map(f=>[f.id,f.name,f.kcal100,round1(f.fat100),round1(f.carbs100),round1(f.protein100),round1(f.fiber100),round1(f.sugar100),f.category,f.updatedAt])])}
function parseMeals(csv){
  const rows=parseCsv(csv).filter(r=>r.some(Boolean));if(!rows.length)return[];
  const header=rows[0].map(x=>String(x||'').trim().toLowerCase());
  const hasHeader=header.includes('id');
  if(!hasHeader){
    return rows.map(r=>({id:r[0]||crypto.randomUUID(),date:r[1]||'',meal:r[2]||'Gustare',foodId:r[3]||'',foodName:r[4]||'',grams:num(r[5]),kcal:num(r[6]),fat:0,carbs:0,protein:0,fiber:0,sugar:0,note:r[7]||'',updatedAt:r[8]||''})).filter(x=>x.date&&x.foodName)
  }
  const ix=n=>headerIndex(header,n);
  return rows.slice(1).map(r=>({
    id:r[ix('id')]||crypto.randomUUID(),date:r[ix('date')]||'',meal:r[ix('meal')]||'Gustare',
    foodId:r[ix('food_id')]||'',foodName:r[ix('food_name')]||'',grams:num(r[ix('grams')]),kcal:num(r[ix('kcal')]),
    fat:ix('fat')>=0?num(r[ix('fat')]):0,carbs:ix('carbs')>=0?num(r[ix('carbs')]):0,protein:ix('protein')>=0?num(r[ix('protein')]):0,
    fiber:ix('fiber')>=0?num(r[ix('fiber')]):0,sugar:ix('sugar')>=0?num(r[ix('sugar')]):0,
    note:ix('note')>=0?(r[ix('note')]||''):'',updatedAt:ix('updated_at')>=0?(r[ix('updated_at')]||''):''
  })).filter(x=>x.date&&x.foodName)
}
function mealsCsv(){return rowsToCsv([['id','date','meal','food_id','food_name','grams','kcal','fat','carbs','protein','fiber','sugar','note','updated_at'],...state.meals.slice().sort((a,b)=>(a.date+a.meal).localeCompare(b.date+b.meal)).map(m=>[m.id,m.date,m.meal,m.foodId,m.foodName,m.grams,m.kcal,round1(m.fat),round1(m.carbs),round1(m.protein),round1(m.fiber),round1(m.sugar),m.note,m.updatedAt])])}


function loadMealShadow(){
  try{
    const raw=localStorage.getItem(MEAL_SHADOW_KEY);
    const list=raw?JSON.parse(raw):[];
    return Array.isArray(list)?list.filter(x=>x&&x.id&&x.date):[];
  }catch(e){console.warn('Shadow jurnal invalid.',e);return[]}
}
function loadDeletedMealIds(){
  try{
    const raw=localStorage.getItem(MEAL_DELETED_KEY);
    const list=raw?JSON.parse(raw):[];
    return new Set(Array.isArray(list)?list:[]);
  }catch(e){return new Set()}
}
function persistMealShadow(){
  try{
    localStorage.setItem(MEAL_SHADOW_KEY,JSON.stringify(state.meals));
    localStorage.setItem(MEAL_DELETED_KEY,JSON.stringify([...state.deletedMealIds]));
  }catch(e){console.warn('Nu am putut salva shadow-ul local.',e)}
}
function mergeMealCollections(remote,local){
  const out=new Map();
  (remote||[]).forEach(r=>{
    if(r?.id&&!state.deletedMealIds.has(r.id))out.set(r.id,r)
  });
  (local||[]).forEach(l=>{
    if(!l?.id||state.deletedMealIds.has(l.id))return;
    const r=out.get(l.id);
    if(!r||recordTime(l)>=recordTime(r))out.set(l.id,l)
  });
  return [...out.values()];
}

const RECENT_LOCAL_GRACE_MS = 120000;

function recordTime(record){
  const t=Date.parse(record?.updatedAt||'');
  return Number.isFinite(t)?t:0;
}

function mergeRemoteWithRecentLocal(remote,local){
  const now=Date.now();
  const out=new Map((remote||[]).map(r=>[r.id,r]));

  (local||[]).forEach(localRecord=>{
    if(!localRecord?.id)return;

    const remoteRecord=out.get(localRecord.id);
    const localTime=recordTime(localRecord);
    const remoteTime=recordTime(remoteRecord);

    if(remoteRecord){
      // Nu lăsăm un snapshot remote mai vechi să suprascrie o modificare locală mai nouă.
      if(localTime>remoteTime)out.set(localRecord.id,localRecord);
      return;
    }

    // EtherCalc poate răspunde pentru scurt timp cu versiunea anterioară după un PUT.
    // Păstrăm înregistrările locale foarte recente ca să nu "dispară" din aplicație.
    if(localTime && now-localTime<RECENT_LOCAL_GRACE_MS){
      out.set(localRecord.id,localRecord);
    }
  });

  return [...out.values()];
}

function sameCollectionByVersion(a,b){
  const sig=list=>(list||[])
    .map(x=>`${x.id}|${x.updatedAt||''}`)
    .sort()
    .join('\n');
  return sig(a)===sig(b);
}

async function seedFoodsIfNeeded(){if(state.foods.length)return;const now=new Date().toISOString();state.foods=DEFAULT_FOODS.map(([name,kcal100,fat100,carbs100,protein100,fiber100,sugar100,category])=>({id:crypto.randomUUID(),name,kcal100,fat100,carbs100,protein100,fiber100,sugar100,category,updatedAt:now}));await putCsv(FOOD_ROOM,foodsCsv());showToast('Am adăugat lista implicită de alimente în EtherCalc.')}
async function syncAll({notify=false}={}){
  // Un refresh remote nu are voie să ruleze peste o salvare aflată în curs.
  if(state.syncing||state.savingMeals||state.savingFoods)return;

  state.syncing=true;
  setSync('Se sincronizează…');

  try{
    const [foodCsv,mealCsv]=await Promise.all([getCsv(FOOD_ROOM),getCsv(LOG_ROOM)]);
    const remoteFoods=parseFoods(foodCsv);
    const remoteMeals=parseMeals(mealCsv);

    const mergedFoods=mergeRemoteWithRecentLocal(remoteFoods,state.foods);
    const mergedMeals=mergeMealCollections(remoteMeals,state.meals);

    state.foods=mergedFoods;
    state.meals=mergedMeals;
    persistMealShadow();

    await seedFoodsIfNeeded();

    const foodHeader=(parseCsv(foodCsv)[0]||[]).map(x=>String(x||'').trim().toLowerCase());
    if(state.foods.length&&(!foodHeader.includes('fiber_per_100g')||!foodHeader.includes('sugar_per_100g'))){
      state.savingFoods=true;
      try{
        await putCsv(FOOD_ROOM,foodsCsv());
        state.lastFoodSaveAt=Date.now();
      }finally{
        state.savingFoods=false;
      }
    }

    renderAll();

    // Dacă remote-ul a venit cu o versiune veche imediat după o salvare,
    // păstrăm local datele și le rescriem pentru auto-reparare.
    if(
      state.meals.length &&
      !sameCollectionByVersion(remoteMeals,state.meals)
    ){
      state.savingMeals=true;
      try{
        await putCsv(LOG_ROOM,mealsCsv());
      }finally{
        state.savingMeals=false;
      }
    }

    setSync(`Sincronizat ${new Date().toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`,'ok');
    if(notify)showToast('Date sincronizate.');
  }catch(e){
    console.error(e);
    setSync('Eroare de conectare','error');
    if(notify)showToast('Nu am putut sincroniza cu EtherCalc.');
  }finally{
    state.syncing=false;
  }
}

async function saveFoods(){
  if(state.savingFoods)return;
  state.savingFoods=true;
  setSync('Se salvează alimentele…');

  const snapshot=state.foods.map(x=>({...x}));

  try{
    const verified=await putAndVerify(FOOD_ROOM,foodsCsv(),verifyFoodsSaved,snapshot);
    state.foods=mergeRemoteWithRecentLocal(verified,snapshot);
    state.lastFoodSaveAt=Date.now();
    renderAll();
    setSync('Baza de alimente salvată și verificată','ok');
  }finally{
    state.savingFoods=false;
  }
}

async function saveMeals(){
  if(state.savingMeals)return;
  state.savingMeals=true;
  setSync('Se salvează jurnalul…');

  const snapshot=state.meals.map(x=>({...x}));
  persistMealShadow();

  try{
    const verified=await putAndVerify(LOG_ROOM,mealsCsv(),verifyMealsSaved,snapshot);

    // Chiar dacă EtherCalc întoarce temporar un snapshot mai vechi,
    // snapshot-ul local tocmai salvat rămâne sursa adevărului.
    state.meals=mergeMealCollections(verified,snapshot);
    persistMealShadow();
    state.lastMealSaveAt=Date.now();
    renderAll();
    setSync('Jurnal salvat și verificat','ok');

    // Confirmare întârziată: eventual-consistency safe.
    setTimeout(async()=>{
      if(state.savingMeals||state.syncing)return;
      try{
        const remote=parseMeals(await getCsv(LOG_ROOM));
        const merged=mergeMealCollections(remote,state.meals);

        if(!sameCollectionByVersion(remote,merged)){
          state.savingMeals=true;
          try{
            await putCsv(LOG_ROOM,rowsToCsv([
              ['id','date','meal','food_id','food_name','grams','kcal','fat','carbs','protein','fiber','sugar','note','updated_at'],
              ...merged.slice().sort((a,b)=>(a.date+a.meal).localeCompare(b.date+b.meal)).map(m=>[
                m.id,m.date,m.meal,m.foodId,m.foodName,m.grams,m.kcal,
                round1(m.fat),round1(m.carbs),round1(m.protein),
                round1(m.fiber),round1(m.sugar),m.note,m.updatedAt
              ])
            ]));
          }finally{
            state.savingMeals=false;
          }
        }

        state.meals=merged;
        persistMealShadow();
        renderAll();
      }catch(err){
        console.warn('Confirmarea întârziată EtherCalc a eșuat.',err);
      }
    },5000);

  }finally{
    state.savingMeals=false;
  }
}

function mealsFor(date){return state.meals.filter(m=>m.date===date)}
function caloriesFor(date){return Math.round(mealsFor(date).reduce((s,m)=>s+m.kcal,0))}
function selectedFood(){return state.foods.find(f=>f.id===el.mealFood.value)}
function nutrientsFor(food,grams){const factor=(Number(grams)||0)/100;return {kcal:Math.round((food?.kcal100||0)*factor),fat:round1((food?.fat100||0)*factor),carbs:round1((food?.carbs100||0)*factor),protein:round1((food?.protein100||0)*factor),fiber:round1((food?.fiber100||0)*factor),sugar:round1((food?.sugar100||0)*factor)}}
function calcPreview(){const f=selectedFood(),g=Number(el.mealGrams.value)||0,n=nutrientsFor(f,g);el.mealPreview.textContent=n.kcal;el.mealFatPreview.textContent=n.fat;el.mealCarbsPreview.textContent=n.carbs;el.mealProteinPreview.textContent=n.protein;el.mealFiberPreview.textContent=n.fiber;el.mealSugarPreview.textContent=n.sugar}
function renderFoodSelect(){const current=el.mealFood.value;el.mealFood.innerHTML='<option value="">— Alege alimentul —</option>';state.foods.slice().sort((a,b)=>a.name.localeCompare(b.name,'ro')).forEach(f=>{const o=document.createElement('option');o.value=f.id;o.textContent=`${f.name} · ${f.kcal100} kcal · P ${round1(f.protein100)}g · C ${round1(f.carbs100)}g · G ${round1(f.fat100)}g · F ${round1(f.fiber100)}g · Z ${round1(f.sugar100)}g /100g`;el.mealFood.appendChild(o)});if([...el.mealFood.options].some(o=>o.value===current))el.mealFood.value=current;calcPreview()}

function renderSummary(){const list=mealsFor(state.selectedDate),total=caloriesFor(state.selectedDate),pct=Math.min(total/TARGET,1)*360;el.selectedDateLabel.textContent=fmtDate(state.selectedDate);el.datePicker.value=state.selectedDate;el.dailyCalories.textContent=total;el.targetRing.style.setProperty('--progress',`${pct}deg`);el.targetRing.classList.toggle('is-over',total>TARGET);el.dayStatus.textContent=total>TARGET?'Peste obiectiv':'În obiectiv';el.dayStatus.classList.toggle('is-over',total>TARGET);const diff=TARGET-total;el.remainingText.textContent=diff>=0?`Mai ai ${diff} kcal disponibile.`:`Ai depășit ținta cu ${Math.abs(diff)} kcal.`;el.metricCalories.textContent=total;el.metricItems.textContent=list.length;
 const byMeal=MEAL_ORDER.map(name=>[name,Math.round(list.filter(m=>m.meal===name).reduce((s,m)=>s+m.kcal,0))]).sort((a,b)=>b[1]-a[1]);if(byMeal[0][1]){el.metricMeal.textContent=byMeal[0][0];el.metricMealSub.textContent=`${byMeal[0][1]} kcal`}else{el.metricMeal.textContent='—';el.metricMealSub.textContent='fără înregistrări'}
 let sum=0;for(let i=0;i<7;i++)sum+=caloriesFor(addDays(state.selectedDate,-i));el.metricAverage.textContent=Math.round(sum/7)}

function renderDiary(){const list=mealsFor(state.selectedDate);el.mealGroups.innerHTML='';el.emptyDiary.hidden=!!list.length;if(!list.length)return;MEAL_ORDER.forEach(type=>{const items=list.filter(m=>m.meal===type);if(!items.length)return;const group=document.createElement('div');group.className='meal-group';const total=Math.round(items.reduce((s,m)=>s+m.kcal,0));group.innerHTML=`<div class="meal-group__title"><strong>${type}</strong><span>${total} kcal</span></div>`;items.sort((a,b)=>a.foodName.localeCompare(b.foodName,'ro')).forEach(m=>{const row=document.createElement('div');row.className='meal-item';row.innerHTML=`<div class="meal-item__name"><strong></strong><span></span></div><div class="meal-item__kcal">${Math.round(m.kcal)} kcal</div><div class="meal-item__actions"><button class="mini-button edit" title="Editează">✎</button><button class="mini-button del" title="Șterge">×</button></div>`;row.querySelector('strong').textContent=m.foodName;row.querySelector('.meal-item__name span').innerHTML=`${m.grams} g · <b>P</b> ${round1(m.protein)}g · <b>C</b> ${round1(m.carbs)}g · <b>G</b> ${round1(m.fat)}g · <b>F</b> ${round1(m.fiber)}g · <b>Z</b> ${round1(m.sugar)}g${m.note?` · ${m.note}`:''}`;row.querySelector('.edit').onclick=()=>openMeal(m.id);row.querySelector('.del').onclick=()=>deleteMeal(m.id);group.appendChild(row)});el.mealGroups.appendChild(group)})}

function renderCalendar(){const d=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth(),1);el.calendarTitle.textContent=d.toLocaleDateString('ro-RO',{month:'long',year:'numeric'}).replace(/^./,c=>c.toUpperCase());const y=d.getFullYear(),m=d.getMonth();const first=(d.getDay()+6)%7;const start=new Date(y,m,1-first);el.calendarGrid.innerHTML='';for(let i=0;i<42;i++){const day=new Date(start);day.setDate(start.getDate()+i);const iso=localISO(day),total=caloriesFor(iso);const b=document.createElement('button');b.type='button';b.className='calendar-day';if(day.getMonth()!==m)b.classList.add('is-outside');if(iso===state.selectedDate)b.classList.add('is-selected');if(total)b.classList.add('has-data');if(total>TARGET)b.classList.add('is-over');b.innerHTML=`<span class="calendar-day__number">${day.getDate()}</span><i class="calendar-day__dot"></i>${total?`<span class="calendar-day__kcal">${total} kcal</span>`:''}`;b.onclick=()=>selectDate(iso);el.calendarGrid.appendChild(b)}}


function normalizeFoodKey(value){
  return String(value||'')
    .trim()
    .toLocaleLowerCase('ro-RO')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ');
}

function headerLookup(header,names){
  for(const name of names){
    const i=header.indexOf(name);
    if(i>=0)return i;
  }
  return -1;
}

async function importFoodsCsvFile(file){
  if(!file)return;

  const text=await file.text();
  const rows=parseCsv(text).filter(r=>r.some(cell=>String(cell||'').trim()!==''));
  if(rows.length<2)throw new Error('Fișierul CSV nu conține alimente.');

  const header=rows[0].map(x=>normalizeFoodKey(x).replace(/\s+/g,'_'));

  const idx={
    id:headerLookup(header,['id']),
    name:headerLookup(header,['name','denumire','aliment']),
    kcal:headerLookup(header,['kcal_per_100g','kcal','calorii','calorii_100g']),
    fat:headerLookup(header,['fat_per_100g','fat','grasimi','grasimi_100g']),
    carbs:headerLookup(header,['carbs_per_100g','carbs','carbohidrati','carbohidrati_100g']),
    protein:headerLookup(header,['protein_per_100g','protein','proteine','proteine_100g']),
    fiber:headerLookup(header,['fiber_per_100g','fiber','fibre','fibre_100g']),
    sugar:headerLookup(header,['sugar_per_100g','sugar','zahar','zahar_100g']),
    category:headerLookup(header,['category','categorie']),
  };

  if(idx.name<0||idx.kcal<0){
    throw new Error('CSV-ul trebuie să conțină cel puțin coloanele name și kcal_per_100g.');
  }

  const now=new Date().toISOString();
  const imported=[];

  for(const row of rows.slice(1)){
    const name=String(row[idx.name]||'').trim();
    if(!name)continue;

    const toNumber=(i)=>{
      if(i<0)return 0;
      const raw=String(row[i]??'').trim().replace(',','.');
      const n=Number(raw);
      return Number.isFinite(n)&&n>=0?n:0;
    };

    imported.push({
      id:idx.id>=0&&String(row[idx.id]||'').trim()?String(row[idx.id]).trim():crypto.randomUUID(),
      name,
      kcal100:round1(toNumber(idx.kcal)),
      fat100:round1(toNumber(idx.fat)),
      carbs100:round1(toNumber(idx.carbs)),
      protein100:round1(toNumber(idx.protein)),
      fiber100:round1(toNumber(idx.fiber)),
      sugar100:round1(toNumber(idx.sugar)),
      category:idx.category>=0?String(row[idx.category]||'').trim():'',
      updatedAt:now
    });
  }

  if(!imported.length)throw new Error('Nu am găsit rânduri valide în CSV.');

  const mergedByName=new Map(state.foods.map(f=>[normalizeFoodKey(f.name),f]));
  let added=0,updated=0;

  imported.forEach(food=>{
    const key=normalizeFoodKey(food.name);
    const existing=mergedByName.get(key);

    if(existing){
      mergedByName.set(key,{...food,id:existing.id,updatedAt:now});
      updated+=1;
    }else{
      mergedByName.set(key,food);
      added+=1;
    }
  });

  state.foods=[...mergedByName.values()];
  renderAll();

  await saveFoods();

  showToast(`Import finalizat: ${added} adăugate, ${updated} actualizate.`);
}

function renderFoods(){const q=el.foodSearch.value.trim().toLocaleLowerCase('ro-RO');let foods=state.foods.filter(f=>!q||`${f.name} ${f.category}`.toLocaleLowerCase('ro-RO').includes(q)).sort((a,b)=>a.name.localeCompare(b.name,'ro'));if(!state.showAllFoods&&!q)foods=foods.slice(0,8);el.foodTable.innerHTML='';foods.forEach(f=>{const row=document.createElement('div');row.className='food-row food-row--nutrition';row.innerHTML='<div class="food-row__name"><strong></strong><span class="food-row__category"></span><div class="food-macros"></div></div><div class="food-row__kcal"></div><button class="mini-button" title="Editează">✎</button>';row.querySelector('strong').textContent=f.name;row.querySelector('.food-row__category').textContent=f.category||'Necategorizat';row.querySelector('.food-row__kcal').innerHTML=`<strong>${f.kcal100}</strong><small>kcal / 100g</small>`;row.querySelector('.food-macros').innerHTML=`<span><b>G</b> ${round1(f.fat100)}g</span><span><b>C</b> ${round1(f.carbs100)}g</span><span><b>P</b> ${round1(f.protein100)}g</span><span><b>F</b> ${round1(f.fiber100)}g</span><span><b>Z</b> ${round1(f.sugar100)}g</span>`;row.querySelector('button').onclick=()=>openFood(f.id);el.foodTable.appendChild(row)});el.showAllFoods.textContent=state.showAllFoods?'Arată mai puține':'Arată toate alimentele';el.showAllFoods.hidden=!!q||state.foods.length<=8}

function drawChart(){const canvas=el.chart,rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const W=rect.width,H=rect.height,pad={l:44,r:16,t:16,b:34};ctx.clearRect(0,0,W,H);const data=[];for(let i=13;i>=0;i--){const date=addDays(state.selectedDate,-i);data.push({date,value:caloriesFor(date)})}const max=Math.max(2200,...data.map(d=>d.value));const chartH=H-pad.t-pad.b,chartW=W-pad.l-pad.r;ctx.font='11px system-ui';ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillStyle='#879089';ctx.strokeStyle='#e8ece8';ctx.lineWidth=1;[0,600,1200,1800,2400].filter(v=>v<=max+200).forEach(v=>{const y=pad.t+chartH-(v/max)*chartH;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();ctx.fillText(v,pad.l-8,y)});const targetY=pad.t+chartH-(TARGET/max)*chartH;ctx.save();ctx.strokeStyle='#d77a35';ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(pad.l,targetY);ctx.lineTo(W-pad.r,targetY);ctx.stroke();ctx.restore();ctx.fillStyle='#b86c32';ctx.textAlign='left';ctx.fillText('1800',pad.l+5,targetY-8);const gap=Math.max(4,chartW/data.length*.18),bw=(chartW/data.length)-gap;data.forEach((d,i)=>{const x=pad.l+i*(chartW/data.length)+gap/2,h=(d.value/max)*chartH,y=pad.t+chartH-h;ctx.fillStyle=d.value>TARGET?'#d77a35':'#4f8b69';ctx.beginPath();roundRect(ctx,x,y,bw,Math.max(h,2),5);ctx.fill();if(i%2===1||W<520)return;ctx.fillStyle='#879089';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(fromISO(d.date).getDate(),x+bw/2,H-pad.b+9)})}
function roundRect(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function renderAll(){renderFoodSelect();renderSummary();renderDiary();renderCalendar();renderFoods();requestAnimationFrame(drawChart)}

function selectDate(iso){state.selectedDate=iso;const d=fromISO(iso);state.calendarMonth=new Date(d.getFullYear(),d.getMonth(),1);renderAll()}
function openMeal(id=''){el.mealForm.reset();el.mealId.value='';el.mealGrams.value=100;el.mealDialogTitle.textContent='Adaugă aliment';renderFoodSelect();if(id){const m=state.meals.find(x=>x.id===id);if(!m)return;el.mealId.value=m.id;el.mealFood.value=m.foodId;el.mealGrams.value=m.grams;el.mealType.value=m.meal;el.mealNote.value=m.note;el.mealDialogTitle.textContent='Editează aliment'}calcPreview();el.mealDialog.showModal()}
function openFood(id=''){el.foodForm.reset();el.foodId.value='';el.foodDialogTitle.textContent='Adaugă aliment';el.deleteFood.hidden=true;if(id){const f=state.foods.find(x=>x.id===id);if(!f)return;el.foodId.value=f.id;el.foodName.value=f.name;el.foodCalories.value=f.kcal100;el.foodFat.value=round1(f.fat100);el.foodCarbs.value=round1(f.carbs100);el.foodProtein.value=round1(f.protein100);el.foodFiber.value=round1(f.fiber100);el.foodSugar.value=round1(f.sugar100);el.foodCategory.value=f.category;el.foodDialogTitle.textContent='Editează aliment';el.deleteFood.hidden=false}el.foodDialog.showModal()}
async function deleteMeal(id){state.deletedMealIds.add(id);state.meals=state.meals.filter(m=>m.id!==id);persistMealShadow();renderAll();try{await saveMeals();showToast('Înregistrare ștearsă.')}catch(e){console.error(e);showToast(`Ștergerea nu a putut fi salvată: ${e.message}`)}}
async function handleMealSubmit(e){e.preventDefault();const f=selectedFood(),grams=Number(el.mealGrams.value);if(!f||!grams||grams<1){showToast('Alege alimentul și introdu cantitatea.');return}const id=el.mealId.value||crypto.randomUUID(),existing=state.meals.find(m=>m.id===id),n=nutrientsFor(f,grams),record={id,date:existing?.date||state.selectedDate,meal:el.mealType.value,foodId:f.id,foodName:f.name,grams,kcal:n.kcal,fat:n.fat,carbs:n.carbs,protein:n.protein,fiber:n.fiber,sugar:n.sugar,note:el.mealNote.value.trim(),updatedAt:new Date().toISOString()};state.deletedMealIds.delete(id);state.meals=existing?state.meals.map(m=>m.id===id?record:m):[...state.meals,record];persistMealShadow();el.mealDialog.close();renderAll();try{await saveMeals();showToast(existing?'Înregistrare actualizată.':'Aliment adăugat.')}catch(err){console.error(err);showToast(`Salvarea a eșuat: ${err.message}`)}}
async function handleFoodSubmit(e){e.preventDefault();const name=el.foodName.value.trim(),kcal=Number(el.foodCalories.value),fat=Number(el.foodFat.value||0),carbs=Number(el.foodCarbs.value||0),protein=Number(el.foodProtein.value||0),fiber=Number(el.foodFiber.value||0),sugar=Number(el.foodSugar.value||0);if(!name||![kcal,fat,carbs,protein,fiber,sugar].every(Number.isFinite)||[kcal,fat,carbs,protein,fiber,sugar].some(v=>v<0)){showToast('Completează corect valorile nutriționale.');return}const id=el.foodId.value||crypto.randomUUID(),existing=state.foods.find(f=>f.id===id),record={id,name,kcal100:round1(kcal),fat100:round1(fat),carbs100:round1(carbs),protein100:round1(protein),fiber100:round1(fiber),sugar100:round1(sugar),category:el.foodCategory.value.trim(),updatedAt:new Date().toISOString()};state.foods=existing?state.foods.map(f=>f.id===id?record:f):[...state.foods,record];el.foodDialog.close();renderAll();try{await saveFoods();showToast(existing?'Aliment actualizat în mapare.':'Aliment adăugat în mapare.')}catch(err){console.error(err);showToast(`Maparea nu a putut fi salvată: ${err.message}`)}}
async function handleDeleteFood(){const id=el.foodId.value,f=state.foods.find(x=>x.id===id);if(!f)return;if(state.meals.some(m=>m.foodId===id)){showToast('Alimentul este folosit în jurnal. Îl poți edita, dar nu șterge.');return}state.foods=state.foods.filter(x=>x.id!==id);el.foodDialog.close();renderAll();try{await saveFoods();showToast('Aliment șters din mapare.')}catch(err){console.error(err);showToast(`Ștergerea nu a putut fi salvată: ${e.message}`)}}
let toastTimer;function showToast(msg){clearTimeout(toastTimer);el.toast.textContent=msg;el.toast.classList.add('show');toastTimer=setTimeout(()=>el.toast.classList.remove('show'),2800)}


function monthBounds(){
  const y=state.calendarMonth.getFullYear(),m=state.calendarMonth.getMonth();
  return {year:y,month:m,start:localISO(new Date(y,m,1)),end:localISO(new Date(y,m+1,0)),days:new Date(y,m+1,0).getDate()};
}
function exportMonthToExcel(){
  if(typeof XLSX==='undefined'){showToast('Modulul Excel nu s-a încărcat. Verifică conexiunea la internet.');return}
  const {year,month,start,end,days}=monthBounds();
  const monthMeals=state.meals.filter(x=>x.date>=start&&x.date<=end).slice().sort((a,b)=>(a.date+a.meal+a.foodName).localeCompare(b.date+b.meal+b.foodName,'ro'));
  const detailRows=monthMeals.map(m=>({
    'Data':m.date,'Masă':m.meal,'Aliment':m.foodName,'Cantitate (g)':num(m.grams),
    'Calorii (kcal)':num(m.kcal),'Grăsimi (g)':round1(m.fat),'Carbohidrați (g)':round1(m.carbs),
    'Proteine (g)':round1(m.protein),'Fibre (g)':round1(m.fiber),'Zahăr (g)':round1(m.sugar),'Notiță':m.note||''
  }));
  if(!detailRows.length)detailRows.push({'Data':'','Masă':'','Aliment':'Nu există înregistrări în această lună','Cantitate (g)':'','Calorii (kcal)':'','Grăsimi (g)':'','Carbohidrați (g)':'','Proteine (g)':'','Fibre (g)':'','Zahăr (g)':'','Notiță':''});
  const summaryRows=[];
  for(let day=1;day<=days;day++){
    const date=localISO(new Date(year,month,day)),rows=mealsFor(date);
    const total=key=>round1(rows.reduce((s,r)=>s+num(r[key]),0));
    const kcal=Math.round(rows.reduce((s,r)=>s+num(r.kcal),0));
    summaryRows.push({
      'Data':date,'Calorii (kcal)':kcal,'Țintă (kcal)':TARGET,'Diferență față de țintă':TARGET-kcal,
      'Status':rows.length?(kcal>TARGET?'Peste țintă':'În obiectiv'):'Fără date',
      'Grăsimi (g)':total('fat'),'Carbohidrați (g)':total('carbs'),'Proteine (g)':total('protein'),
      'Fibre (g)':total('fiber'),'Zahăr (g)':total('sugar'),'Alimente înregistrate':rows.length
    });
  }
  const wb=XLSX.utils.book_new();
  const wsDetail=XLSX.utils.json_to_sheet(detailRows);
  const wsSummary=XLSX.utils.json_to_sheet(summaryRows);
  wsDetail['!cols']=[{wch:12},{wch:14},{wch:28},{wch:14},{wch:15},{wch:14},{wch:19},{wch:15},{wch:12},{wch:12},{wch:30}];
  wsSummary['!cols']=[{wch:12},{wch:15},{wch:14},{wch:22},{wch:16},{wch:14},{wch:19},{wch:15},{wch:12},{wch:12},{wch:20}];
  XLSX.utils.book_append_sheet(wb,wsDetail,'Detaliu');
  XLSX.utils.book_append_sheet(wb,wsSummary,'Rezumat zilnic');
  const monthLabel=String(month+1).padStart(2,'0');
  XLSX.writeFile(wb,`calorii_${year}-${monthLabel}.xlsx`);
  showToast(`Excel pentru ${new Date(year,month,1).toLocaleDateString('ro-RO',{month:'long',year:'numeric'})} a fost generat.`);
}

$('#openMealDialog').onclick=()=>openMeal();$('#openMealDialog2').onclick=()=>openMeal();$('#emptyAdd').onclick=()=>openMeal();$('#closeMealDialog').onclick=()=>el.mealDialog.close();$('#cancelMeal').onclick=()=>el.mealDialog.close();el.mealForm.addEventListener('submit',handleMealSubmit);el.mealFood.addEventListener('change',calcPreview);el.mealGrams.addEventListener('input',calcPreview);
$('#openFoodDialog').onclick=()=>openFood();
$('#closeFoodDialog').onclick=()=>el.foodDialog.close();
$('#cancelFood').onclick=()=>el.foodDialog.close();
el.foodForm.addEventListener('submit',handleFoodSubmit);
el.deleteFood.onclick=handleDeleteFood;
el.foodSearch.addEventListener('input',renderFoods);
el.showAllFoods.onclick=()=>{state.showAllFoods=!state.showAllFoods;renderFoods()};
el.importFoodsCsv.onclick=()=>el.foodCsvInput.click();
el.foodCsvInput.addEventListener('change',async()=>{
  const [file]=el.foodCsvInput.files||[];
  if(!file)return;
  try{
    setSync('Se importă baza de alimente…');
    await importFoodsCsvFile(file);
  }catch(err){
    console.error(err);
    setSync('Import eșuat','error');
    showToast(`Importul CSV a eșuat: ${err.message}`);
  }finally{
    el.foodCsvInput.value='';
  }
});
el.syncButton.onclick=()=>syncAll({notify:true});el.prevDay.onclick=()=>selectDate(addDays(state.selectedDate,-1));el.nextDay.onclick=()=>selectDate(addDays(state.selectedDate,1));el.openDatePicker.onclick=()=>{try{el.datePicker.showPicker()}catch(_){el.datePicker.click()}};el.datePicker.addEventListener('change',()=>el.datePicker.value&&selectDate(el.datePicker.value));el.todayButton.onclick=()=>selectDate(todayISO());el.exportMonthExcel.onclick=exportMonthToExcel;el.prevMonth.onclick=()=>{state.calendarMonth=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth()-1,1);renderCalendar()};el.nextMonth.onclick=()=>{state.calendarMonth=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth()+1,1);renderCalendar()};
window.addEventListener('resize',()=>requestAnimationFrame(drawChart));
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden && Date.now()-state.lastMealSaveAt>8000 && Date.now()-state.lastFoodSaveAt>8000)syncAll()
});
window.addEventListener('online',()=>syncAll({notify:true}));
setInterval(()=>{
  if(
    !document.hidden &&
    !state.savingMeals &&
    !state.savingFoods &&
    Date.now()-state.lastMealSaveAt>8000 &&
    Date.now()-state.lastFoodSaveAt>8000
  )syncAll()
},SYNC_MS);
state.deletedMealIds=loadDeletedMealIds();state.meals=mergeMealCollections([],loadMealShadow());renderAll();syncAll();
