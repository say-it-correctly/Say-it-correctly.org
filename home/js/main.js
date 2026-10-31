'use strict';
const $=id=>document.getElementById(id);
const H=(key,vars={})=>{const v=window.LXL_HOME_UI[LXL.lang][key];return typeof v==='string'?v.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??''):v};
const menu=$('menu'),links=$('links');
menu.onclick=()=>menu.setAttribute('aria-expanded',String(links.classList.toggle('open')));
links.querySelectorAll('a').forEach(a=>a.onclick=()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')});
document.addEventListener?.('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});
if($('speak'))$('speak').onclick=()=>window.LXLAudio.speakEnglish('Good morning',{
 onstart:()=>{$('audio-status').textContent=LXL.t('voiceStarted',{word:'Good morning'})},
 onend:()=>{$('audio-status').textContent=H('audio')},
 onerror:error=>{$('audio-status').textContent=(error.code==='voiceUnavailable'?H('noVoice'):LXL.t(error.code))+(error.detail?' ('+error.detail+')':'')}
});
window.LXLAudio?.onError(error=>{const status=$('effect-status');if(!status)return;status.hidden=false;status.dataset.audioError=error.code;status.textContent=LXL.t(error.code)});
const choices=[...document.querySelectorAll('#choices .choice')];let exerciseAnswer=null;
function renderExercise(){if(!$('feedback'))return;const thanks={en:'An expression of gratitude','zh-CN':'谢谢',fr:'Merci',pt:'Obrigado',es:'Gracias'},morning={en:'Good morning','zh-CN':'早上好',fr:'Bonjour',pt:'Bom dia',es:'Buenos días'};
 choices.forEach((b,i)=>b.textContent=i===1?thanks[LXL.lang]:i===0?morning[LXL.lang]:H('meanings')[1]);
 $('feedback').textContent=exerciseAnswer===null?'':exerciseAnswer?H('correct'):H('incorrect')+' '+thanks[LXL.lang];
}
choices.forEach(b=>b.onclick=()=>{if(exerciseAnswer!==null)return;exerciseAnswer=b.dataset.ok==='true';choices.forEach(x=>{x.disabled=true;x.classList.toggle('selected',x===b)});renderExercise();if(exerciseAnswer)window.LXLAudio?.playSuccess?.();else window.LXLAudio.playError()});
if($('reset'))$('reset').onclick=()=>{exerciseAnswer=null;choices.forEach(b=>{b.disabled=false;b.classList.remove('selected')});renderExercise()};
const words=[['Hello',0,'Hello, Anna!'],['Goodbye',0,'Goodbye, see you!'],['Mother',1,'My mother is kind.'],['Brother',1,'My brother is here.'],['Apple',2,'I eat an apple.'],['Water',2,'I drink water.'],['Airport',3,'Where is the airport?'],['Ticket',3,'I have a ticket.']];
const topicIDs=['Saludos','Familia','Comida','Viajes'];let topic='all';const revealed=new Set();
function renderVocabulary(){if(!$('search'))return;const q=$('search').value.trim().toLocaleLowerCase(LXL.lang),container=$('flashcards');container.replaceChildren();
 const items=words.map((w,i)=>({w,i})).filter(({w,i})=>(topic==='all'||topicIDs[w[1]]===topic)&&[w[0],H('meanings')[i],H('topics')[w[1]]].some(s=>s.toLocaleLowerCase(LXL.lang).includes(q)));
 if(!items.length){const p=document.createElement('p');p.textContent=H('empty');container.append(p);return}
 items.forEach(({w,i},index)=>{const b=document.createElement('button');b.type='button';b.className='card flash';
 const label=document.createElement('small'),strong=document.createElement('strong'),p=document.createElement('p');strong.style.display='block';
 label.textContent=H('topics')[w[1]];strong.textContent=revealed.has(i)?H('meanings')[i]:w[0];strong.lang=revealed.has(i)?LXL.lang:'en';p.textContent=revealed.has(i)?H('example')+': '+w[2]:H('reveal')+'';
 b.setAttribute('aria-label',(revealed.has(i)?H('english'):H('reveal'))+': '+w[0]);b.setAttribute('aria-pressed',String(revealed.has(i)));
 b.append(label,strong,p);b.onclick=()=>{revealed.has(i)?revealed.delete(i):revealed.add(i);renderVocabulary();container.children[index]?.focus()};container.append(b)});
}
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c===b));topic=b.dataset.topic;renderVocabulary()});if($('search'))$('search').oninput=renderVocabulary;
const questions=[['I ___ a student.',['am','is','are'],0],['She ___ English every day.',['study','studies','studying'],1],['Yesterday, we ___ to school.',['go','gone','went'],2],['Choose the plural of “child”.',['children','childs','childes'],0],['If it rains, I ___ at home.',['stayed','will stay','have stayed'],1],['I have lived here ___ 2020.',['for','during','since'],2]];
let quizIndex=-1,quizAnswers=[];
function renderQuiz(focus=false){if(!$('knowledge-test'))return;const box=$('knowledge-test');box.replaceChildren();$('assessment-link').hidden=quizIndex!==questions.length;
 if(quizIndex===questions.length){const result=document.createElement('h3');result.tabIndex=-1;result.textContent=H('quizResult',{n:quizAnswers.reduce((sum,a,i)=>sum+Number(a===questions[i][2]),0)});box.append(result);const restart=document.createElement('button');restart.className='btn primary';restart.textContent=H('quizStart');restart.onclick=()=>{quizIndex=0;quizAnswers=[];renderQuiz(true)};box.append(restart);if(focus)result.focus();return}
 if(quizIndex<0){const start=document.createElement('button');start.className='btn primary';start.textContent=H('quizStart');start.onclick=()=>{quizIndex=0;renderQuiz(true)};box.append(start);return}
 const progress=document.createElement('p');progress.textContent=H('quizProgress',{n:quizIndex+1});const prompt=document.createElement('p');prompt.textContent=H('quizPrompt');const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.lang='en';legend.textContent=questions[quizIndex][0];legend.tabIndex=-1;fieldset.append(legend);
 questions[quizIndex][1].forEach((text,n)=>{const label=document.createElement('label');label.className='quiz-option';label.lang='en';const radio=document.createElement('input');radio.type='radio';radio.name='quiz-answer';radio.value=n;radio.checked=quizAnswers[quizIndex]===n;radio.onchange=()=>{quizAnswers[quizIndex]=n;next.disabled=false};label.append(radio,document.createTextNode(' '+text));fieldset.append(label)});
 const next=document.createElement('button');next.className='btn primary';next.textContent=H(quizIndex===questions.length-1?'quizFinish':'quizNext');next.disabled=quizAnswers[quizIndex]===undefined;next.onclick=()=>{if(next.disabled)return;next.disabled=true;if(quizAnswers[quizIndex]===questions[quizIndex][2])window.LXLAudio?.playSuccess?.();quizIndex++;renderQuiz(true)};box.append(progress,prompt,fieldset,next);if(focus)legend.focus();
}
// END_QUIZ
const questionForm=$('question-form');if(questionForm)questionForm.onsubmit=e=>e.preventDefault();
function translateHome(){const lang=LXL.lang,control=$('home-language');control.value=lang;control.setAttribute('aria-label',LXL.t('language'));
 for(const [selector,texts] of Object.entries(window.LXL_HOME_TEXTS).filter(([selector])=>!selector.startsWith('.links ')))document.querySelectorAll(selector).forEach(el=>{if(selector==='.hero h1')el.innerHTML=texts[lang];else el.textContent=texts[lang]});
 if($('body-link'))$('body-link').href='../practice/parts-of-body/index.html?lang='+encodeURIComponent(lang);menu.textContent=H('menu');document.querySelector('nav').setAttribute('aria-label',H('nav'));document.querySelector('.hero .illustration')?.removeAttribute('aria-label');
 if($('search')){$('search').placeholder=H('search');$('search').setAttribute('aria-label',H('search'))}if($('audio-status'))$('audio-status').textContent=H('audio');
 document.querySelectorAll('.level span').forEach((el,i)=>el.textContent=H('levels')[i]);
 const form=$('question-form');if(form){form.querySelectorAll('label').forEach((label,i)=>{const text=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(text)text.textContent=H('labels')[i];const input=label.querySelector('input,textarea');if(input)input.placeholder=i===1?'name@example.com':H('labels')[i]});
 const selects=form.querySelectorAll('select');selects[0].options[0].textContent=H('levelOptions')[0];selects[0].options[7].textContent=H('levelOptions')[1];[...selects[1].options].forEach((o,i)=>o.textContent=H('categoryOptions')[i]);form.querySelector('button').removeAttribute('title');}
 const effectStatus=$('effect-status');if(effectStatus?.dataset.audioError)effectStatus.textContent=LXL.t(effectStatus.dataset.audioError);
 renderExercise();renderVocabulary();renderQuiz();
}
$('home-language').onchange=e=>LXL.setLang(e.target.value);document.addEventListener('lxl-language-change',translateHome);translateHome();
