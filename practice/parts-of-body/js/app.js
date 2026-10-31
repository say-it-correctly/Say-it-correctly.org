(async()=>{const C=window.SICCommerce;try{await C.bootstrap();
"use strict";
const PRICE_USD=1,FREE_LIMIT=6;const DATA=C.current.words,MARKERS=C.current.markers;
const $=id=>document.getElementById(id);
const T=(key,vars)=>key==='foot'?C.text('practiceNote'):key==='step4'?C.text('continuationRule'):key==='priceNote'?C.text('manual'):(window.LXL?.t?.(key,vars)||key);
for(const lang of window.LXL.supported){const index=['en','es','fr','pt','zh-CN'].indexOf(lang);window.LXL.dictionaries[lang].foot=["Answers are checked by the server. Payments are external and manually verified.","Las respuestas se validan en el servidor. Los pagos son externos y se verifican manualmente.","Les réponses sont vérifiées par le serveur. Les paiements sont externes et vérifiés manuellement.","As respostas são validadas no servidor. Os pagamentos são externos e verificados manualmente.","答案由服务器验证。付款在平台外进行，并由管理员人工核实。"][index];}
function updateBodyLocale(){
 const map={'body-instruction':'instruction','body-choose':'choose','body-words-count':'words','body-drag-help':'drag'};for(const [id,key] of Object.entries(map)){const e=$(id);if(e)e.textContent=T(key)}
 document.querySelector('[data-ui=demo]').textContent=C.text('free');document.querySelector('.footer').textContent=T('foot');
 const back=document.querySelector('.header a.btn-white');if(back){back.textContent=T('back');back.href='../../home/index.html?lang='+encodeURIComponent(window.LXL.lang)}
 const help=$('reopen-tutorial');if(help)help.textContent=T('help');
 const reset=$('reset');if(reset)reset.textContent=T('reset');
 const cart=$('preview');if(cart)cart.textContent=T('cart');
 const counter=$('counter');if(counter)counter.textContent=`${T('counter')}: ${completed.size} / ${C.current.paid?24:FREE_LIMIT}`;
 document.querySelectorAll('.guide h2').forEach(e=>e.textContent=T('guide'));
 document.querySelectorAll('.guide .step').forEach((e,i)=>{const k=['step1','step2','step3','step4'][i];if(k)e.textContent=`${i+1}. ${T(k)}`});
 const select=$('body-language');if(select)select.value=window.LXL.lang;
 document.querySelector('.brand small').textContent=T('brandNote');document.querySelector('.guide .hint').textContent=T('voiceHelp');
 $('close').setAttribute('aria-label',T('close'));$('body-language').setAttribute('aria-label',T('language'));$('progress').setAttribute('aria-label',T('counter'));
 $('figure-scroll').setAttribute('aria-label',T('figureLabel'));$('figure').setAttribute('aria-label',T('figureLabel'));$('figure').querySelector('img').alt=T('figureLabel');
 updateUI();document.querySelectorAll('.speak').forEach(e=>e.setAttribute('aria-label',T('pronounceLabel',{word:itemFor(e.parentElement.dataset.id).english})));if(lastStatus)statusMsg('','',lastStatus.key,lastStatus.vars);else $('status').textContent=T('step1');
 const effectStatus=$('effect-status');if(effectStatus?.dataset.audioError)effectStatus.textContent=T(effectStatus.dataset.audioError);
 if(modalName)translateOpenDialog(modalName);
}
function translateOpenDialog(){const area=$('dialog-content');area.querySelectorAll('[data-t]').forEach(e=>e.textContent=T(e.dataset.t));refreshVoices();}

const matches=new Map(Object.entries(C.current.matches||{}));let busy=false;let completed=new Set(C.current.completed||[]),selected=null,highlighted=null,locked=false,voicePreference='female',modalName='',dragGhost=null;
const itemFor=id=>DATA.find(d=>d.id===id);
let lastStatus=null;
function statusMsg(cn,es,key,vars){if(key)lastStatus={key,vars};$('status').textContent=key&&window.LXL?.t?T(key,vars):window.LXL?.lang==='zh-CN'?cn:es}
// Shared English voice inventory; exercise-specific messages stay localized.
function availableVoice(preference=voicePreference){return window.LXLAudio.voiceFor(preference)}
function voiceDescription(voice,fallback){
 const hint=window.LXLAudio.voiceGender(voice);
 return [fallback?T(fallback):'',voice?T('voiceIdentity',{word:voice.name+' ('+voice.lang+')'}):'',hint?T('voiceGenderHint',{gender:T(hint)}):''].filter(Boolean).join(' ');
}
function refreshVoices(){
 for(const gender of ['female','male']){const option=$('voice-option-'+gender);if(option){const matches=window.LXLAudio.voices.filter(v=>window.LXLAudio.voiceGender(v)===gender);option.textContent=matches.length?T('voiceOptionAvailable',{word:matches.map(v=>v.name+' ('+v.lang+')').join(', ')}):T('voiceOptionMissing')}}
 const notice=$('voice-status');if(!notice)return;const voice=availableVoice(),fallback=window.LXLAudio.voiceFallback(voicePreference,voice);notice.textContent=!window.speechSynthesis||!window.SpeechSynthesisUtterance?T('voiceUnsupported'):voiceDescription(voice,fallback);
}
function stopSpeech(){window.LXLAudio.stopSpeech()}
function speak(word){if(modalName==='tutorial')$('voice-error')?.remove();window.LXLAudio.speakEnglish(word,{gender:voicePreference,
 onstart:({voice,fallback})=>audioVoiceMessage('voiceStarted',{word,voice,fallback}),
 onerror:error=>audioVoiceMessage(error.code,{gender:T(voicePreference)},error.detail)
})}
function audioVoiceMessage(key,vars,detail){
 if(modalName==='tutorial'){
  if(key==='voiceStarted'){$('voice-error')?.remove();return}
  let error=$('voice-error');if(!error){error=document.createElement('p');error.id='voice-error';error.setAttribute('role','status');error.setAttribute('aria-live','polite');error.setAttribute('data-t','voiceFail');$('dialog-content').insertBefore(error,$('start'))}
  error.textContent=T('voiceFail');return;
 }
 if(key==='voiceStarted')return;
 const message=window.LXL?T('voiceFail'):'No se pudo reproducir el audio. Inténtalo de nuevo.';statusMsg(message,message);
}
// Close facial markers retain their approved hit areas. Resolve overlapping
// areas by the nearest centre instead of whichever button is last in the DOM.
function markerAtPoint(x,y){
if(!document.elementFromPoint(x,y)?.closest('.target'))return null;
let nearest=null,distance=Infinity;
for(const dot of document.querySelectorAll('.target')){const r=dot.getBoundingClientRect();if(x<r.left||x>r.right||y<r.top||y>r.bottom)continue;const delta=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));if(delta<distance){nearest=dot;distance=delta}}
return nearest;
}
function playError(){return window.LXLAudio.playError()}

function render(){const words=$('words'),targets=$('targets'),lines=$('target-lines');words.replaceChildren();targets.replaceChildren();lines.replaceChildren();for(const d of DATA){
 const card=document.createElement('div');card.className='word-card';card.dataset.id=d.id;card.setAttribute('role','group');const choose=document.createElement('button');choose.type='button';choose.className='choose-word';choose.textContent=d.english;choose.dataset.id=d.id;choose.setAttribute('aria-label',T('chooseLabel',{word:d.english}));choose.addEventListener('click',()=>chooseWord(d.id));choose.addEventListener('pointerdown',e=>startDrag(e,d,choose));const audio=document.createElement('button');audio.className='speak';audio.type='button';audio.textContent='🔊';audio.setAttribute('aria-label',T('pronounceLabel',{word:d.english}));audio.addEventListener('click',()=>speak(d.english));card.append(choose,audio);words.append(card);}
 for(const d of MARKERS){const dot=document.createElement('button');dot.type='button';dot.className='target';dot.dataset.id=d.id;dot.style.left=d.controlX+'%';dot.style.top=d.controlY+'%';dot.setAttribute('aria-label',T('markerLabel',{word:MARKERS.indexOf(d)+1}));dot.innerHTML='<span class="target-dot" aria-hidden="true">•</span>';dot.addEventListener('click',e=>{const point=(e.detail?markerAtPoint(e.clientX,e.clientY):dot)?.dataset.id;if(!point)return;const word=[...matches].find(x=>x[1]===point)?.[0];if(word&&completed.has(word)){recall(word);return}if(selected&&!locked)attempt(selected,point)});targets.append(dot);if(Math.hypot(d.targetX-d.controlX,d.targetY-d.controlY)>1.15){const ns='http://www.w3.org/2000/svg';const line=document.createElementNS(ns,'line');line.dataset.id=d.id;line.setAttribute('x1',d.controlX/100*887);line.setAttribute('y1',d.controlY/100*1774);line.setAttribute('x2',d.targetX/100*887);line.setAttribute('y2',d.targetY/100*1774);lines.append(line);const spot=document.createElementNS(ns,'circle');spot.dataset.id=d.id;spot.setAttribute('cx',d.targetX/100*887);spot.setAttribute('cy',d.targetY/100*1774);spot.setAttribute('r',2.6);lines.append(spot)}}updateUI();}
function chooseWord(id){if(completed.has(id)){recall(id);return}if(locked)return;selected=id;highlighted=null;updateUI();const d=itemFor(id);statusMsg('','', 'selected',{word:d.english})}
function recall(id){if(!completed.has(id))return;highlighted=highlighted===id?null:id;selected=null;updateUI();if(highlighted){const card=$('words').querySelector(`[data-id="${id}"].word-card`);const dot=$('targets').querySelector(`[data-id="${matches.get(id)}"]`);card?.scrollIntoView({block:'nearest'});dot?.scrollIntoView({block:'nearest'});const d=itemFor(id);statusMsg('','','review',{word:d.english})}else statusMsg('','','unreview')}
function updateUI(){for(const card of document.querySelectorAll('.word-card')){const id=card.dataset.id,done=completed.has(id);card.classList.toggle('done',done);card.classList.toggle('recall',done&&highlighted===id);card.classList.toggle('selected',selected===id&&!done);card.querySelector('.choose-word').textContent=itemFor(id).english+(done?' ✓':'');card.querySelector('.choose-word').disabled=(locked&&!done)||(!C.current.paid&&!C.current.freeWordIds.includes(id)&&!done);card.querySelector('.choose-word').setAttribute('aria-label',T(done?'reviewLabel':'chooseLabel',{word:itemFor(id).english}))}for(const dot of document.querySelectorAll('.target')){const word=[...matches].find(x=>x[1]===dot.dataset.id)?.[0];dot.classList.toggle('correct',!!word&&completed.has(word));dot.classList.toggle('recall',word===highlighted);dot.setAttribute('aria-label',T(word?'reviewLabel':'markerLabel',{word:word?itemFor(word).english:MARKERS.findIndex(d=>d.id===dot.dataset.id)+1}))}for(const e of document.querySelectorAll('#target-lines [data-id]'))e.classList.toggle('recall',matches.get(highlighted)===e.dataset.id)}
async function attempt(wordId,pointId){if(locked||busy||!wordId||completed.has(wordId))return;busy=true;try{const result=await C.attempt(wordId,pointId);selected=null;highlighted=null;if(result.correct){if(!completed.has(wordId)&&!result.already)window.LXLAudio?.playSuccess?.();completed.add(wordId);matches.set(wordId,pointId);statusMsg('','','correct',{word:itemFor(wordId).english});}else{statusMsg('','','retry',{word:itemFor(wordId).english});playError();}locked=result.locked;$('counter').textContent=T('counter')+': '+result.count+' / '+result.limit;$('progress').setAttribute('aria-valuemax',result.limit);$('progress').setAttribute('aria-valuenow',result.count);$('fill').style.width=(100*result.count/result.limit)+'%';updateUI();if(result.locked)setTimeout(()=>openModal('success'),550);}catch(error){if(error.code==='practice_cancelled'){$('status').textContent=T('step1');return;}$('status').textContent=error.code==='permission_required'?C.text('pending'):C.errorText(error);if(error.code==='permission_required'||error.code==='invalid_or_expired_token')openModal('form');}finally{busy=false}}
let skipClick=false;
function startDrag(e,d,button){
 if(e.button!==0||e.isPrimary===false||locked||completed.has(d.id))return;
 const x=e.clientX,y=e.clientY,pointer=e.pointerId,touch=e.pointerType==='touch';
 let moved=false,held=false;
 const hold=touch?setTimeout(()=>{held=true},300):null;
 const clean=()=>{
  clearTimeout(hold);
  window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);
  window.removeEventListener('touchmove',touchMove);window.removeEventListener('touchend',touchEnd);window.removeEventListener('touchcancel',cancel);
  dragGhost?.remove();dragGhost=null;document.querySelectorAll('.target').forEach(t=>t.classList.remove('is-hover'));
 };
 const track=(point,event)=>{
  const dx=point.clientX-x,dy=point.clientY-y;
  if(!moved){
   if(Math.hypot(dx,dy)<=9)return;
   // A quick vertical swipe belongs to native scrolling. A sideways gesture or
   // a stationary hold followed by movement deliberately starts a touch drag.
   if(touch&&!held&&Math.abs(dx)<=Math.abs(dy)*1.2){clean();return}
   moved=true;clearTimeout(hold);dragGhost=document.createElement('div');dragGhost.className='drag-ghost';dragGhost.textContent=d.english;document.body.append(dragGhost);
  }
  if(event.cancelable)event.preventDefault();
  dragGhost.style.left=point.clientX+'px';dragGhost.style.top=point.clientY+'px';
  const sc=$('figure-scroll'),r=sc.getBoundingClientRect();
  if(point.clientX>r.left&&point.clientX<r.right){
   if(sc.scrollHeight>sc.clientHeight){if(point.clientY<r.top+45)sc.scrollTop-=17;if(point.clientY>r.bottom-45)sc.scrollTop+=17}
   else if(point.clientY<45)window.scrollBy(0,-17);else if(point.clientY>window.innerHeight-45)window.scrollBy(0,17);
  }
  document.querySelectorAll('.target').forEach(t=>t.classList.remove('is-hover'));markerAtPoint(point.clientX,point.clientY)?.classList.add('is-hover');
 };
 const finish=point=>{const hit=moved?markerAtPoint(point.clientX,point.clientY):null;clean();if(moved){skipClick=true;setTimeout(()=>skipClick=false,150);if(hit)attempt(d.id,hit.dataset.id);else statusMsg('','','returned')}};
 const move=ev=>{if(!touch&&ev.pointerId===pointer)track(ev,ev)};
 const up=ev=>{if(!touch&&ev.pointerId===pointer)finish(ev)};
 const cancel=()=>clean();
 const touchMove=ev=>{if(ev.touches.length!==1){clean();return}track(ev.touches[0],ev)};
 const touchEnd=ev=>{if(ev.changedTouches.length)finish(ev.changedTouches[0]);else clean()};
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
 if(touch){window.addEventListener('touchmove',touchMove,{passive:false});window.addEventListener('touchend',touchEnd);window.addEventListener('touchcancel',cancel)}
}
function reset(){selected=null;highlighted=null;updateUI();closeModal();$('status').textContent=C.text('reset')}
let returnFocus=null;
function dialog(html,type){if(!modalName)returnFocus=document.activeElement;const box=$('dialog-content');box.innerHTML=html;$('dialog').classList.toggle('tutorial-dialog',type==='tutorial');$('overlay').classList.add('open');modalName=type;setBackgroundInert(true);translateOpenDialog(type);$('close').focus()}
const tx=(key,tag='p')=>'<'+tag+' data-t="'+key+'">'+T(key)+'</'+tag+'>';
function openModal(type){if(type==='cart'||type==='form'){dialog('<h2 id="dialog-title"></h2>','form');C.mountAccess($('dialog-content'),session=>{completed=new Set(session.completed);matches.clear();Object.entries(session.matches||{}).forEach(([word,point])=>matches.set(word,point));locked=false;closeModal();updateUI();$('counter').textContent=T('counter')+': '+completed.size+' / 24';$('progress').setAttribute('aria-valuemax',24);$('progress').setAttribute('aria-valuenow',completed.size);$('fill').style.width=(100*completed.size/24)+'%'});return;}
 const title={tutorial:'tutorialTitle',success:'success',cart:'cartTitle',form:'formTitle'}[type];
 let html='<h2 id="dialog-title" data-t="'+title+'">'+T(title)+'</h2>';
 if(type==='tutorial')html+=tx('tutorialIntro')+'<div class="demo-area"><div class="demo-word" lang="en">Eye 🔊</div><div class="demo-arrow" aria-hidden="true">➜</div><div class="demo-target" aria-hidden="true">✓</div></div><div class="tutorial-steps">'+[1,2,3,4].map(n=>tx('step'+n,'div')).join('')+'</div>'+'<div class="voice-choices">'+['female','male'].map(g=>'<label><input type="radio" name="voice" value="'+g+'" '+(voicePreference===g?'checked':'')+'><span data-t="'+g+'">'+T(g)+'</span></label>').join('')+'<button class="btn btn-white" id="voice-test" data-t="test">'+T('test')+'</button></div><button class="btn btn-red" id="start" data-t="start">'+T('start')+'</button>';
 if(type==='success')html+=tx('successText')+'<div class="benefits">'+[1,2,3].map(n=>tx('benefit'+n,'div')).join('')+'</div><button class="btn btn-red" id="buy" data-t="continue">'+T('continue')+'</button><button class="btn btn-white" id="later" data-t="later">'+T('later')+'</button>'+tx('priceNote');
 if(type==='cart')html+=tx('productDemo')+'<div class="cartitem"><b lang="en">Parts of the Body</b>'+tx('quantity','span')+'<strong>$1.00 USD</strong></div><div class="total">'+tx('total','span')+'<strong>$1.00 USD</strong></div>'+tx('priceNote')+'<button class="btn btn-red" id="next" data-t="formAction">'+T('formAction')+'</button><button class="btn btn-white" id="back" data-t="backCart">'+T('backCart')+'</button>';
 if(type==='form')html+=tx('formNote')+'<div class="fields">'+['name','email','country','language','message'].map(k=>'<label><span data-t="'+k+'">'+T(k)+'</span><input disabled type="'+(k==='email'?'email':'text')+'"></label>').join('')+'</div>'+tx('priceNote')+'<button class="btn btn-red" disabled data-t="sendDisabled">'+T('sendDisabled')+'</button><button class="btn btn-white" id="back" data-t="backCart">'+T('backCart')+'</button>';
 dialog(html,type);
 if(type==='tutorial'){document.querySelectorAll('input[name="voice"]').forEach(r=>r.onchange=()=>{stopSpeech();voicePreference=r.value;refreshVoices()});$('voice-test').onclick=()=>speak('Hello! Let us learn English.');$('start').onclick=closeModal;}
 if(type==='success'){$('buy').onclick=()=>openModal('cart');$('later').onclick=closeModal;}
 if(type==='cart'){$('next').onclick=()=>openModal('form');$('back').onclick=closeModal;}
 if(type==='form')$('back').onclick=()=>openModal('cart');
}
function setBackgroundInert(on){
 document.documentElement.classList.toggle('modal-open',on);
 document.querySelectorAll('body>header,body>main,body>.intro,body>footer,body>[data-ui="demo"]').forEach(e=>e.inert=on);
}
function closeModal(){C.cancelPracticeStart?.();$('overlay').classList.remove('open');modalName='';setBackgroundInert(false);returnFocus?.focus()}
$('close').onclick=closeModal;
$('body-language').addEventListener('change',e=>window.LXL.setLang(e.target.value));
document.addEventListener('lxl-language-change',updateBodyLocale);
$('overlay').onclick=e=>{if(e.target===$('overlay'))closeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalName)closeModal();if(e.key==='Tab'&&modalName){const b=[...$('dialog').querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')],first=b[0],last=b.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
$('reset').onclick=reset;$('preview').onclick=()=>openModal('cart');$('reopen-tutorial').onclick=()=>openModal('tutorial');
// Prevent an ordinary click after a drag from accidentally selecting the word.
document.addEventListener('click',e=>{if(skipClick){e.stopPropagation();e.preventDefault();skipClick=false}},true);
window.LXLAudio.onVoicesChanged(refreshVoices);refreshVoices();
window.LXLAudio.onError(error=>{if(!['effectFail','successEffectFail'].includes(error.code))return;const status=$('effect-status');status.hidden=false;status.dataset.audioError=error.code;status.textContent=T(error.code)});
render();updateBodyLocale();
// A first-time visitor selects an instruction language before beginning.
function showLanguageWelcome(){
 const layer=document.createElement('div');layer.className='language-welcome';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','lang-welcome-title');
 layer.innerHTML=`<section class="language-welcome-panel"><h2 id="lang-welcome-title"></h2><p id="lang-welcome-help"></p><label for="welcome-language">🌐</label><select id="welcome-language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="fr">Français</option><option value="pt">Português</option><option value="es">Español</option></select><button type="button" id="welcome-go" class="btn btn-red"></button></section>`;
 document.body.append(layer);setBackgroundInert(true);const sel=layer.querySelector('#welcome-language');sel.value=window.LXL.lang;
 const draw=()=>{layer.querySelector('label').textContent=T('language');layer.querySelector('#lang-welcome-title').textContent=T('pick');layer.querySelector('#lang-welcome-help').textContent=T('pickHelp');layer.querySelector('#welcome-go').textContent=T('continue')};draw();
 sel.addEventListener('change',()=>{window.LXL.setLang(sel.value);draw()});
 layer.querySelector('#welcome-go').addEventListener('click',()=>{layer.remove();openModal('tutorial')});layer.addEventListener('keydown',e=>{if(e.key==='Tab'){const first=sel,last=layer.querySelector('#welcome-go');if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});sel.focus();
}
showLanguageWelcome();

// Exercise header menu lifecycle. The shared renderer and other pages stay intact.
const bindCommercialMenu=()=>{
 let boundMenu=null;
 const menu=()=>document.querySelector('.header .body-site-menu');
 function syncMenu(){
  const m=menu(),summary=m?.querySelector('summary'),nav=m?.querySelector('nav');if(!summary||!nav)return;
  const label=window.LXL?.t('bodyMenu')||'Menu';summary.textContent=label;
  summary.setAttribute('aria-label',[label,nav.getAttribute('aria-label')].filter(Boolean).join(': '));summary.setAttribute('aria-expanded',String(m.open));
  nav.id='body-menu-links';summary.setAttribute('aria-controls',nav.id);
  if(!m.open)return;
  const r=summary.getBoundingClientRect(),width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
  const below=height-r.bottom-8,above=r.top-8,up=below<120&&above>below;
  const space=Math.max(44,up?above-8:below-8);nav.style.maxHeight=space+'px';
  const panel=nav.getBoundingClientRect();nav.style.left=Math.max(8,Math.min(r.left,width-panel.width-8))+'px';
  nav.style.top=(up?Math.max(8,r.top-panel.height-8):r.bottom+8)+'px';
 }
 function bindMenu(){const m=menu();if(m&&m!==boundMenu){m.addEventListener('toggle',syncMenu);boundMenu=m}syncMenu()}
 document.addEventListener('pointerdown',event=>{const m=menu();if(m?.open&&!m.contains(event.target)){m.open=false;syncMenu()}});
 document.addEventListener('click',event=>{const m=menu();if(event.target.closest('.body-site-menu nav a')&&m){m.open=false;syncMenu()}});
 document.addEventListener('keydown',event=>{const m=menu();if(event.key==='Escape'&&m?.open){m.open=false;syncMenu();m.querySelector('summary').focus()}});
 window.addEventListener('resize',syncMenu);window.visualViewport?.addEventListener('resize',syncMenu);
 window.addEventListener('scroll',()=>{if(menu()?.open)syncMenu()},{passive:true});
 document.addEventListener('lxl-language-change',bindMenu);bindMenu();
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindCommercialMenu);else bindCommercialMenu();

}catch(error){const messages={en:'The exercise could not load. Reload the page or contact support.',es:'No se pudo cargar el ejercicio. Recarga la página o contacta al soporte.','zh-CN':'无法加载练习。请刷新页面或联系支持人员。',fr:'Impossible de charger l’exercice. Actualisez la page ou contactez l’assistance.',pt:'Não foi possível carregar o exercício. Recarregue a página ou contate o suporte.'};const language=window.LXL?.lang||'en',status=document.getElementById('status'),select=document.getElementById('body-language');if(select)select.value=language;if(status){status.setAttribute('role','alert');status.textContent=C?.errorText?C.errorText(error):messages[language]||messages.en;}}})();
