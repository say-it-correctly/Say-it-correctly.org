/* Reusable local navigation and editorial content; no network calls or services. */
(()=>{'use strict';
 const data=window.LXL_OFFICIAL_CONTENT;
 const node=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el};
 const currentBody=()=>/\/practice\/parts-of-body\/index\.html$/.test(location.pathname);
 function localURL(page,hash=''){
  const url=new URL((currentBody()?'../../':'../')+page,document.baseURI);url.searchParams.set('lang',LXL.lang);url.hash=hash;return url.href;
 }
 function internal(key,text){const destinations={home:'home/index.html',learn:'learn/index.html',practice:'practice/index.html',vocabulary:'vocabulary/index.html',videos:'videos/index.html',body:'practice/parts-of-body/index.html',test:'level-test/index.html',games:'games/index.html',method:'method/index.html',about:'about/index.html',contact:'contact/index.html'};
  const page=destinations[key],a=node('a',text);a.href=key==='body'&&currentBody()?'#figure':localURL(page);
  if(location.pathname.endsWith('/'+page))a.setAttribute('aria-current','page');return a;
 }
 function external(text,url,description){const a=node('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.title=description;return a}
 const footerCopy={
  en:{tagline:'Learn, practice and grow your English.',explore:'Explore',resources:'Resources',review:"Learn and practice English.",top:'Back to top',back:'Back to games and practice',activity:'Match 24 English words to the body using touch or drag, and listen to their pronunciation.',labels:['Home','Learn','Practice','Vocabulary','Videos','Free test','Games and practice','Our method','About us','Official YouTube']},
  'zh-CN':{tagline:'学习与练习，让英语不断进步。',explore:'探索',resources:'资源',review:"学习和练习英语。",top:'返回顶部',back:'返回游戏与练习',activity:'通过点击或拖动，将24个英语单词与身体部位配对，并聆听发音。',labels:['首页','学习','练习','词汇','视频','免费测试','游戏与练习','我们的方法','关于我们','官方 YouTube']},
  fr:{tagline:'Apprenez, pratiquez et progressez en anglais.',explore:'Explorer',resources:'Ressources',review:"Apprenez et pratiquez l’anglais.",top:'Retour en haut',back:'Retour aux jeux et à la pratique',activity:'Associez 24 mots anglais aux parties du corps par toucher ou glisser, et écoutez leur prononciation.',labels:['Accueil','Apprendre','Pratiquer','Vocabulaire','Vidéos','Test gratuit','Jeux et pratique','Notre méthode','À propos de nous','YouTube officiel']},
  pt:{tagline:'Aprenda, pratique e avance no inglês.',explore:'Explorar',resources:'Recursos',review:"Aprenda e pratique inglês.",top:'Voltar ao topo',back:'Voltar a jogos e prática',activity:'Associe 24 palavras em inglês às partes do corpo com toque ou arraste e ouça a pronúncia.',labels:['Início','Aprender','Praticar','Vocabulário','Vídeos','Teste gratuito','Jogos e prática','Nosso método','Sobre nós','YouTube oficial']},
  es:{tagline:'Aprende, practica y avanza con tu inglés.',explore:'Explorar',resources:'Recursos',review:"Aprende y practica inglés.",top:'Volver arriba',back:'Volver a Juegos y práctica',activity:'Relaciona 24 palabras en inglés con las partes del cuerpo tocando o arrastrando y escucha su pronunciación.',labels:['Inicio','Aprende','Practica','Vocabulario','Videos','Test gratuito','Juegos y práctica','Nuestro método','Nosotros','YouTube oficial']}
 };
 const contactCTA={en:'Contact us','zh-CN':'联系我们',fr:'Contactez-nous',pt:'Fale conosco',es:'Contáctanos'};
 const aboutTitles={en:'About us','zh-CN':'关于我们',fr:'À propos de nous',pt:'Sobre nós',es:'Nosotros'};
 const contactTitles={en:'Contact','zh-CN':'联系',fr:'Contact',pt:'Contato',es:'Contacto'};
 for(const lang of Object.keys(footerCopy))footerCopy[lang].labels[8]=aboutTitles[lang];
 function primaryLinks(){const copy=footerCopy[LXL.lang],items=[internal('home',copy.labels[0]),internal('method',copy.labels[7]),internal('about',copy.labels[8]),internal('contact',contactCTA[LXL.lang])];const cta=items[3];cta.className='btn navbtn';cta.href+='#contact-form';return items}
 function renderPrimaryNavigation(){const links=document.querySelector('#links');if(!links)return;links.replaceChildren(...primaryLinks());for(const a of links.children)a.onclick=()=>{links.classList.remove('open');document.querySelector('#menu')?.setAttribute('aria-expanded','false')}}
 function revealContactForm(){if(location.hash!=='#contact-form')return;const form=document.querySelector('#contact-form');if(!form)return;const reveal=()=>{const header=document.querySelector('.header');if(header?.getBoundingClientRect&&form.style)form.style.scrollMarginTop=(header.getBoundingClientRect().height+16)+'px';form.scrollIntoView?.({block:'start',behavior:'auto'});form.focus?.({preventScroll:true})};if(window.requestAnimationFrame)window.requestAnimationFrame(reveal);else reveal()}
 function renderFooter(footer,text){
  const copy=footerCopy[LXL.lang],institution={
   en:{translations:'Translations',navigation:'Navigation',social:'Social networks',address:'Address',phone:'Telephone',country:'United States',languages:['Spanish','English','German','French','Italian']},
   'zh-CN':{translations:'翻译服务',navigation:'导航',social:'社交网络',address:'地址',phone:'电话',country:'美国',languages:['西班牙语','英语','德语','法语','意大利语']},
   fr:{translations:'Traductions',navigation:'Navigation',social:'Réseaux sociaux',address:'Adresse',phone:'Téléphone',country:'États-Unis',languages:['Espagnol','Anglais','Allemand','Français','Italien']},
   pt:{translations:'Traduções',navigation:'Navegação',social:'Redes sociais',address:'Endereço',phone:'Telefone',country:'Estados Unidos',languages:['Espanhol','Inglês','Alemão','Francês','Italiano']},
   es:{translations:'Traducciones',navigation:'Navegación',social:'Redes sociales',address:'Dirección',phone:'Teléfono',country:'Estados Unidos',languages:['Español','Inglés','Alemán','Francés','Italiano']}
  }[LXL.lang];footer.replaceChildren();footer.className='footer site-footer';
  const wrap=node('div');wrap.className='site-footer-wrap';const grid=node('div');grid.className='site-footer-grid';
  const identity=node('div');identity.className='site-footer-identity';const brand=internal('home','');brand.className='site-footer-brand';
  const logo=node('img');logo.src=new URL((currentBody()?'../../':'../')+'shared/assets/logo-oficial-say-it-correctly.png',document.baseURI).href;logo.alt='Say-it-correctly.org';logo.width=217;logo.height=146;logo.className='site-footer-logo';brand.append(logo,node('strong','Say it Correctly'));identity.append(brand);
  const location=node('p','Florida, USA.');location.className='site-footer-location';const address=node('address',institution.address+': 6917 S.W. 104 CT, 33173.');address.className='site-footer-address';identity.append(location,address);
  const contacts=node('dl');contacts.className='site-footer-contacts';
  for(const [label,value,href,country]of [[institution.phone,'+57 310 432 2050','tel:+573104322050',false],['Magic Jack','813 406 6043','tel:+18134066043',true]]){const row=node('div');row.className='site-footer-contact-row';const detail=node('dd'),a=node('a',value);a.href=href;detail.append(a);if(country)detail.append(node('span',' · '+institution.country));row.append(node('dt',label),detail);contacts.append(row)}identity.append(contacts);
  if(currentBody()){const note=node('small',LXL.t?.('foot')||'');note.className='site-footer-demo';identity.append(note)}
  const translations=node('section');translations.className='site-footer-translations';const translationTitle=node('h2',institution.translations);translationTitle.id='footer-translations';translations.setAttribute('aria-labelledby',translationTitle.id);translations.append(translationTitle);const languages=node('ul');languages.className='site-footer-languages';['es','en','de','fr','it'].forEach((code,i)=>{const li=node('li',institution.languages[i]);li.setAttribute('data-language',code);languages.append(li)});translations.append(languages);
  const socials=node('ul');socials.className='site-footer-socials';socials.setAttribute('aria-label',institution.social);
  const socialData=[['Facebook','https://www.facebook.com/sayitcorrectly/','M14 21v-8h3l1-4h-4V7c0-1 1-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8'],[copy.labels[9],'https://www.youtube.com/channel/UCiMPTJ-R4Ht3DwohQhuKg0g','M21 7v10c0 2-18 2-18 0V7c0-2 18-2 18 0ZM10 9l5 3-5 3Z'],['Instagram','https://www.instagram.com/sayitcorrectly/','M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01'],['X (Twitter)','https://twitter.com/SayItCorrectly1','M4 3h4l12 18h-4ZM20 3 4 21']];
  for(const [label,url,path]of socialData){const li=node('li'),a=external('',url,label);a.setAttribute('aria-label',label);const icon=node('span');icon.className='site-footer-social-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="'+path+'"></path></svg>';a.append(icon);li.append(a);socials.append(li)}translations.append(socials);
  const nav=node('nav');nav.className='site-footer-navigation';nav.setAttribute('aria-label',institution.navigation);nav.append(node('h2',institution.navigation));const links=node('ul');for(const a of primaryLinks()){a.className='';const li=node('li');li.append(a);links.append(li)}nav.append(links);
  grid.append(identity,translations,nav);const bottom=node('div');bottom.className='site-footer-bottom';bottom.append(node('small','Say it Correctly'),node('small',copy.review));
  const top=node('button',copy.top);top.type='button';top.className='site-footer-top';top.onclick=()=>{window.scrollTo({top:0,behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});document.querySelector('.header .brand')?.focus?.({preventScroll:true})};bottom.append(top);wrap.append(grid,bottom);footer.append(wrap);
 }
 function render(){const text=data.texts[LXL.lang];if(!text)return;
  renderPrimaryNavigation();
  // Body locale refresh replaces footer text. Rebuild this component afterwards.
  const footer=document.querySelector('.footer');if(footer)renderFooter(footer,text);
  if(currentBody()){const back=document.querySelector('.header a.btn-white');if(back){back.textContent=footerCopy[LXL.lang].back;back.href=localURL('games/index.html')}}
  // The approved activity keeps its header controls; add a compact native menu.
  const bodyHeader=currentBody()?document.querySelector('.header'):null;
  if(bodyHeader){let menu=bodyHeader.querySelector('.body-site-menu');if(!menu){menu=node('details');menu.className='body-site-menu';menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus()}});bodyHeader.append(menu)}const wasOpen=menu.open;menu.replaceChildren();menu.open=wasOpen;menu.append(node('summary',text.nav));const nav=node('nav');nav.setAttribute('aria-label',text.nav);
   nav.append(...primaryLinks());menu.append(nav)}
  const hub=document.querySelector('#games-hub');if(hub){hub.replaceChildren();const wrap=node('div');wrap.className='wrap';wrap.append(node('h2',text.gamesTitle));
   const card=internal('body','');card.className='game-activity-card';const icon=node('span','');icon.className='game-activity-icon';icon.setAttribute('aria-hidden','true');
   // Same local line-icon style as Home, with no external assets.
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('focusable','false');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 10h14M12 8v7M12 15l-4 6M12 15l4 6');svg.append(path);icon.append(svg);
   const surface=node('div');surface.className='game-activity-surface';const title=node('h3','Parts of the Body');title.lang='en';title.id='game-body-title';const description=node('p',footerCopy[LXL.lang].activity);description.id='game-body-description';card.setAttribute('aria-labelledby',title.id);card.setAttribute('aria-describedby',description.id);surface.append(title,description);card.append(icon,surface);wrap.append(card);
   const actions=node('div');actions.className='official-actions';const practiceName=footerCopy[LXL.lang].labels[2];actions.append(internal('practice',practiceName),external(text.legacyGames,'https://www.sayitcorrectly.org/juego',text.external));wrap.append(actions);hub.append(wrap)}
  window.LXLRoutes?.updateLinks();
  revealContactForm();
  const section=document.querySelector('#official-programme');if(!section)return;
  section.replaceChildren();const wrap=node('div');wrap.className='wrap';section.append(wrap);
  const h=node('h2',text.philosophy);h.id='official-philosophy-title';wrap.append(h,node('p',text.copy));
  const comparison=window.LXL_HOME_TEXTS?.['#method-comparison']?.[LXL.lang];if(comparison){const p=node('p',comparison);p.id='method-comparison';wrap.append(p)}
  const title=node('h3',text.programme);title.id='official-programme-title';wrap.append(title,node('p',text.chaptersNote));
  const list=node('ol');list.className='official-chapters';
  for(const chapter of data.chapters){const li=node('li'),a=external(chapter.titles[LXL.lang],chapter.url,text.external);a.lang=LXL.lang;li.append(a);const note=node('small',text.legacy);li.append(note);list.append(li)}wrap.append(list);
  const additional=node('section');additional.className='method-supplementary';additional.setAttribute('aria-labelledby','method-supplementary-title');const additionalTitle=node('h3',text.additionalResourcesTitle);additionalTitle.id='method-supplementary-title';additional.append(additionalTitle);for(const resource of data.additionalResources){const p=node('p'),a=external(resource.titles[LXL.lang],resource.url,text.external);a.className='lxl-link supplementary-resource';p.append(a);additional.append(p)}wrap.append(additional);
 }
 // Navigation/content only: exercise state, audio and tutorial are untouched.
 document.addEventListener('lxl-language-change',render);render();
 window.addEventListener?.('hashchange',revealContactForm);
 window.LXLPlatform={localURL,render,brand:data.brand,labels:()=>footerCopy[LXL.lang].labels,contactCTA:()=>contactCTA[LXL.lang],pageTitle:key=>key==='about'?aboutTitles[LXL.lang]:contactTitles[LXL.lang]};
})();


/* Shared mobile menu lifecycle; preserves the existing toggle and link renderer. */
document.addEventListener('DOMContentLoaded',()=>{
 const button=document.getElementById('menu'),panel=document.getElementById('links');if(!button||!panel)return;
 function close(){panel.classList.remove('open');button.setAttribute('aria-expanded','false')}
 function position(){
  if(!panel.classList.contains('open'))return;
  if(window.innerWidth>900){close();for(const name of ['left','top','max-height'])panel.style.removeProperty(name);return}
  button.setAttribute('aria-expanded','true');
  const anchor=button.getBoundingClientRect(),width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
  const below=height-anchor.bottom-8,above=anchor.top-8,up=below<120&&above>below;
  panel.style.maxHeight=Math.max(44,(up?above:below)-8)+'px';
  const box=panel.getBoundingClientRect(),parent=(panel.offsetParent||document.querySelector('.header')).getBoundingClientRect();
  panel.style.left=Math.max(8,Math.min(anchor.left,width-box.width-8))-parent.left+'px';
  panel.style.top=(up?Math.max(8,anchor.top-box.height-8):anchor.bottom+8)-parent.top+'px';
 }
 button.addEventListener('click',position);
 panel.addEventListener('click',event=>{if(event.target.closest('a'))close()});
 document.addEventListener('pointerdown',event=>{if(panel.classList.contains('open')&&!panel.contains(event.target)&&!button.contains(event.target))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.classList.contains('open')){close();button.focus()}});
 window.addEventListener('resize',position);window.visualViewport?.addEventListener('resize',position);
 window.addEventListener('scroll',position,{passive:true});document.addEventListener('lxl-language-change',position);
});

/* End shared mobile menu lifecycle. */
/* Presentation only: preserve each translated heading's exact text and hierarchy. */
(()=>{'use strict';
 if(typeof MutationObserver==='undefined')return;
 const languages=['en','zh-CN','fr','pt','es'],rules=new Map();
 // Exact approved titles only. Each accent is an editorial choice, never a last-word heuristic.
 function register(texts,accents){languages.forEach((language,i)=>{const text=texts[language],accent=accents[i];if(text&&accent&&text!==accent&&text.includes(accent))rules.set(text,accent)})}
 const table=window.LXL_HOME_TEXTS||{};
 const translated={
  '#about-mission-title':['mission','使命','mission','missão','misión'],
  '#about-purpose-title':['purpose','宗旨','objectif','propósito','propósito'],
  '#about-philosophy-title':['Educational','教育','éducative','educativa','educativa'],
  '#about-team-title':['team','团队','équipe','equipe','equipo'],
  '#about-reach-title':['international outlook','国际视野','internationale','internacional','internacional'],
  '#about-information-title':['Institutional','机构','institutionnelles','institucionais','institucional'],
  '#about-social-title':['Social','社交','sociaux','sociais','sociales'],
  '#about-close-title':['learning','学习','apprendre','aprendendo','aprendiendo'],
  '#about-translation-title':['translation','翻译','traduction','tradução','traducción'],
  '#about-interface-title':['Interface','界面','interface','interface','interfaz'],
  '.section#aprender h2':['where you are','起点','votre niveau','onde você está','donde estés'],
  '#practicar h2':['practicing','练习','pratiquer','praticar','practicar'],
  '#vocabulario h2':['everyday','日常','quotidien','dia a dia','cotidiano'],
  '#videos h2':['learning','学习','apprendre','aprendendo','aprendiendo'],
  '#preguntas h2':['question','问题','question','dúvida','pregunta'],
  '#preguntas .panel>h3':['question','问题','question','dúvida','duda'],
  '.learning-features h2':['learn and practice','学习与练习','apprendre et pratiquer','aprender e praticar','aprender y practicar'],
  '.learning-features .card:nth-child(1) h3':['Clear','清晰','claires','claras','claras']
 };
 for(const [key,accents]of Object.entries(translated))if(table[key])register(table[key],accents);
 const sets=[
  [['Learn English and connect with the world.','学习英语，连接世界。','Apprenez l’anglais et ouvrez-vous au monde.','Aprenda inglês e conecte-se com o mundo.','Aprende inglés y conecta con el mundo.'],['with the world','连接世界','au monde','com o mundo','con el mundo']],
  [['Listen, understand and practice at your own pace.','按照自己的节奏聆听、理解和练习。','Écoutez, comprenez et pratiquez à votre rythme.','Ouça, compreenda e pratique no seu ritmo.','Escucha, comprende y practica a tu ritmo.'],['at your own pace','自己的节奏','à votre rythme','no seu ritmo','a tu ritmo']],
  [['English connects people and cultures.','英语连接人与文化。','L’anglais relie les personnes et les cultures.','O inglês conecta pessoas e culturas.','El inglés conecta personas y culturas.'],['people and cultures','人与文化','les personnes et les cultures','pessoas e culturas','personas y culturas']],
  [['We are here to listen.','我们愿意倾听。','Nous sommes à votre écoute.','Estamos aqui para ouvir você.','Estamos para escucharte.'],['to listen','倾听','votre écoute','ouvir você','para escucharte']],
  [['Learn English through play.','在游戏中学习英语。','Apprenez l’anglais en jouant.','Aprenda inglês brincando.','Aprende inglés jugando.'],['through play','游戏','en jouant','brincando','jugando']],
  [['A path for independent learning','自主学习的路径','Un parcours pour apprendre en autonomie','Um percurso de aprendizagem autônoma','Un recorrido de autoaprendizaje'],['independent learning','自主学习','en autonomie','autônoma','autoaprendizaje']],
  [['Put your learning into practice','将所学付诸实践','Mettez vos connaissances en pratique','Coloque o aprendizado em prática','Pon en práctica lo aprendido'],['into practice','实践','en pratique','em prática','en práctica']],
  [['Audiovisual practice','视听练习','Pratique audiovisuelle','Prática audiovisual','Práctica audiovisual'],['Audiovisual','视听','audiovisuelle','audiovisual','audiovisual']],
  [['Explore your English learning resources','探索英语学习资源','Explorez vos ressources pour apprendre l’anglais','Explore seus recursos para aprender inglês','Explora tus recursos para aprender inglés'],['learning resources','学习资源','ressources','recursos','recursos']],
  [['Free test','免费测试','Test gratuit','Teste gratuito','Test gratuito'],['Free','免费','gratuit','gratuito','gratuito']],
  [['Our method','我们的方法','Notre méthode','Nosso método','Nuestro método'],['method','方法','méthode','método','método']]
 ];
 for(const [titles,accents]of sets)register(Object.fromEntries(languages.map((l,i)=>[l,titles[i]])),accents);
 for(const key of ['philosophy','programme'])register(Object.fromEntries(languages.map(l=>[l,window.LXL_OFFICIAL_CONTENT?.texts[l]?.[key]])),key==='philosophy'?['one step at a time','自主学习','étape par étape','passo a passo','paso a paso']:['12-chapter','12章','12 chapitres','12 capítulos','12 capítulos']);
 // The activity title keeps its English wording; words/questions inside the exercise are excluded.
 rules.set('Parts of the Body','Body');
 function decorate(){
  for(const heading of document.querySelectorAll('main h1,main h2,main h3,.intro h1')){
   if(heading.closest?.('a,button,dialog,[role="dialog"],.footer,#house-catalog,#knowledge-test,#practicar .panel,.about-person-name'))continue;
   if(heading.querySelector('.title-accent'))continue;
   const text=heading.textContent,phrase=rules.get(text);if(!phrase)continue;
   if(heading.querySelector('svg,img,button,a,input'))continue;
   heading.classList?.add('title-harmony');
   const start=text.indexOf(phrase),accent=document.createElement('span');accent.className='title-accent';accent.textContent=phrase;
   heading.replaceChildren(document.createTextNode(text.slice(0,start)),accent,document.createTextNode(text.slice(start+phrase.length)));
  }
 }
 // Observe the page root so headings rebuilt by local renderers are covered too.
 const root=document.querySelector('main')||document.body;
 const observer=new MutationObserver(decorate);if(root)observer.observe(root,{childList:true,characterData:true,subtree:true});
 decorate();
})();
