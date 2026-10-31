/* Titles and compact home resource hub, backed by the existing language packs. */
(()=>{'use strict';
const labels={
 en:{title:'Explore your English learning resources',intro:'Phonetics, grammar and pronunciation: learn independently, then put your knowledge into practice.',menu:'Main navigation',back:'Home'},
 'zh-CN':{title:'探索英语学习资源',intro:'语音、语法与发音：自主学习，再通过练习巩固知识。',menu:'主导航',back:'首页'},
 fr:{title:'Explorez vos ressources pour apprendre l’anglais',intro:'Phonétique, grammaire et prononciation : apprenez en autonomie, puis mettez vos connaissances en pratique.',menu:'Navigation principale',back:'Accueil'},
 pt:{title:'Explore seus recursos para aprender inglês',intro:'Fonética, gramática e pronúncia: aprenda por conta própria e coloque seus conhecimentos em prática.',menu:'Navegação principal',back:'Início'},
 es:{title:'Explora tus recursos para aprender inglés',intro:'Fonética, gramática y pronunciación: aprende por tu cuenta y pon tus conocimientos en práctica.',menu:'Navegación principal',back:'Inicio'}
};
// Localized Home access copy. Learning content and other page headings keep their packs.
const resourcePages=['learn','practice','vocabulary','videos','test','games','method','about'];
const resourceCopy={
 en:[['Learn','Build your foundations in phonetics and grammar.'],['Practice','Listen, pronounce and try short exercises.'],['Vocabulary','Explore useful words for everyday life.'],['Videos','Discover audiovisual learning on our official channel.'],['Free test','Try a free, informal check of your knowledge.'],['Games and practice','Put English into action with interactive activities.'],['Our method','Connect phonetics, grammar and independent learning.'],['About us','Discover our purpose and educational philosophy.'],['Parts of the Body','Explore body vocabulary with an interactive activity.']],
 'zh-CN':[['学习','通过语音和语法学习打好基础。'],['练习','聆听、练习发音并完成简短练习。'],['词汇','探索日常生活中的实用词汇。'],['视频','在官方频道探索视听学习资源。'],['免费测试','通过免费的非正式测试了解自己的知识。'],['游戏与练习','通过互动活动运用英语。'],['我们的方法','结合语音、语法与自主学习。'],['关于我们','了解我们的宗旨与教育理念。'],['身体部位','通过互动活动学习身体部位的英语词汇。']],
 fr:[['Apprendre','Consolidez vos bases en phonétique et en grammaire.'],['Pratiquer','Écoutez, prononcez et faites de courts exercices.'],['Vocabulaire','Explorez les mots utiles de la vie quotidienne.'],['Vidéos','Découvrez des ressources audiovisuelles sur notre chaîne officielle.'],['Test gratuit','Faites un bilan gratuit et indicatif de vos connaissances.'],['Jeux et pratique','Mettez l’anglais en pratique avec des activités interactives.'],['Notre méthode','Associez phonétique, grammaire et apprentissage autonome.'],['À propos de nous','Découvrez notre objectif et notre philosophie éducative.'],['Parties du corps','Explorez le vocabulaire du corps avec une activité interactive.']],
 pt:[['Aprender','Construa suas bases em fonética e gramática.'],['Praticar','Ouça, pratique a pronúncia e faça exercícios curtos.'],['Vocabulário','Explore palavras úteis para o dia a dia.'],['Vídeos','Descubra recursos audiovisuais no nosso canal oficial.'],['Teste gratuito','Faça uma avaliação gratuita e orientativa dos seus conhecimentos.'],['Jogos e prática','Coloque o inglês em ação com atividades interativas.'],['Nosso método','Conecte fonética, gramática e aprendizagem autônoma.'],['Sobre nós','Conheça nosso propósito e nossa filosofia educativa.'],['Partes do corpo','Explore o vocabulário do corpo em uma atividade interativa.']],
 es:[['Aprende','Construye tus bases de fonética y gramática.'],['Practica','Escucha, pronuncia y resuelve ejercicios breves.'],['Vocabulario','Explora palabras útiles para la vida cotidiana.'],['Videos','Descubre recursos audiovisuales en nuestro canal oficial.'],['Test gratuito','Prueba una evaluación gratuita y orientativa.'],['Juegos y práctica','Pon el inglés en acción con actividades interactivas.'],['Nuestro método','Relaciona fonética, gramática y autoaprendizaje.'],['Nosotros','Conoce nuestro propósito y filosofía educativa.'],['Parts of the Body','Explora el vocabulario corporal con una actividad interactiva.']]
};
// A single line-icon family, drawn locally; no fonts, downloads or decorative arrows.
const resourceIcons=[
 'M12 5v15M3 4h4c2 0 4 1 5 2 1-1 3-2 5-2h4v15h-4c-2 0-4 0-5 1-1-1-3-1-5-1H3Z',
 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11v1a7 7 0 0 0 14 0v-1M12 19v3M8 22h8',
 'M4 4h16v16H4ZM7 16l4-8 4 8M9 13h4M17 8v8',
 'M4 4h16v16H4ZM10 8l6 4-6 4Z',
 'M8 4H5v17h14V4h-3M8 2h8v5H8ZM8 12l1 1 2-2M14 12h2M8 17l1 1 2-2M14 17h2',
 'M7 7h10c3 0 5 10 3 12-1 1-4-3-5-3H9c-1 0-4 4-5 3-2-2 0-12 3-12ZM7 10v5M5 12.5h4M16 11h.01M18 14h.01',
 'M4 4h6v6H4ZM14 14h6v6h-6ZM14 4h6v6h-6ZM4 14h6v6H4ZM10 7h4M7 10v4M17 10v4M10 17h4',
 'M4 4h16v13h-7l-5 4v-4H4ZM8 9h8M8 13h5',
 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 10h14M12 8v7M12 15l-4 6M12 15l4 6'
];
function resourceCard(page,index,language){
 const [title,description]=resourceCopy[language][index],a=document.createElement('a');
 a.className='resource-card';a.href=LXLRoutes.url(page);
 const titleID='resource-title-'+page,descriptionID='resource-description-'+page;
 a.setAttribute('aria-labelledby',titleID);a.setAttribute('aria-describedby',descriptionID);
 const top=document.createElement('span');top.className='resource-card-top';top.setAttribute('aria-hidden','true');
 const icon=document.createElement('span');icon.className='resource-icon';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('focusable','false');
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',resourceIcons[index]);svg.append(path);icon.append(svg);
 const number=document.createElement('span');number.className='resource-number';number.textContent=String(index+1).padStart(2,'0');top.append(icon,number);
 const surface=document.createElement('div');surface.className='resource-surface';const h=document.createElement('h3');h.id=titleID;h.textContent=title;
 const p=document.createElement('p');p.id=descriptionID;p.textContent=description;surface.append(h,p);a.append(top,surface);return a;
}
function removeHomeDecorativeArrows(){
 if(LXLRoutes.current()!=='home')return;
 // Run after the legacy translation renderer, including each locale refresh.
 for(const a of document.querySelectorAll('.navbtn,.hero .actions .btn,#body-link,.footer a[target="_blank"]')){const clean=a.textContent.replace(/\s*[→➜➝➞➟➠➡↗]\s*$/u,'');if(clean!==a.textContent)a.textContent=clean}
}
function render(){const l=LXL.lang,t=labels[l],official=LXL_OFFICIAL_CONTENT.texts[l],table=LXL_HOME_TEXTS;
 const navigation=window.LXLPlatform?.labels();if(navigation){resourceCopy[l][4][0]=navigation[5];resourceCopy[l][7][0]=navigation[8]}
 const names={home:table['.links a:nth-child(1)'][l],learn:table['.links a:nth-child(2)'][l],practice:table['.links a:nth-child(3)'][l],vocabulary:table['.links a:nth-child(4)'][l],videos:table['.links a:nth-child(5)'][l],test:official.test,games:official.games,method:official.method,contact:official.contact,body:official.body};
 if(navigation){names.test=navigation[5];names.method=navigation[7];names.about=navigation[8];names.contact=window.LXLPlatform.pageTitle('contact')}
 const key=LXLRoutes.current(),heading=document.querySelector('[data-page-title]');if(heading)heading.textContent=names[key];document.title=names[key]+' | Say-it-correctly.org';
 const back=document.querySelector('[data-back-home]');if(back){back.textContent=t.back;back.href=LXLRoutes.url('home')}
 const hub=document.querySelector('#resource-hub');if(hub){hub.replaceChildren();hub.setAttribute('aria-labelledby','resource-hub-title');const wrap=document.createElement('div');wrap.className='wrap';hub.append(wrap);const title=document.createElement('h2');title.id='resource-hub-title';title.textContent=t.title;const intro=document.createElement('p');intro.className='resource-intro';intro.textContent=t.intro;wrap.append(title,intro);const grid=document.createElement('div');grid.className='resource-grid';resourcePages.forEach((page,index)=>grid.append(resourceCard(page,index,l)));wrap.append(grid)}
 removeHomeDecorativeArrows();
 const listen=document.querySelector('.illustration a.float');if(listen)listen.href=LXLRoutes.url('games');
 LXLRoutes.updateLinks();
}
document.addEventListener('lxl-language-change',render);render();
})();
