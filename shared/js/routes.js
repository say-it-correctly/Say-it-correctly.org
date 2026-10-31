/* Relative to each one-level page directory; compatible with file:// and subpaths. */
(()=>{'use strict';
 const paths={home:'home/index.html',learn:'learn/index.html',practice:'practice/index.html',vocabulary:'vocabulary/index.html',videos:'videos/index.html',test:'level-test/index.html',games:'games/index.html',method:'method/index.html',about:'about/index.html',contact:'contact/index.html',body:'practice/parts-of-body/index.html'};
 const legacy={aprender:'learn',practicar:'practice',vocabulario:'vocabulary',videos:'videos',diagnostico:'test','official-programme':'method',metodo:'method',preguntas:'contact','games-practice':'games'};
 function url(key,language=window.LXL.lang){if(!paths[key])throw Error('Unknown page: '+key);const target=new URL((/\/practice\/parts-of-body\/index\.html$/.test(location.pathname)?'../../':'../')+paths[key],document.baseURI);target.searchParams.set('lang',language);return target.href}
 function current(){return Object.keys(paths).find(key=>location.pathname.endsWith('/'+paths[key]))||'home'}
 function migrateLegacy(){if(current()!=='home')return false;const key=legacy[(location.hash||'').slice(1)];if(!key)return false;location.replace(url(key));return true}
 function updateLinks(){for(const a of document.querySelectorAll?.('a[href]')||[]){const raw=a.getAttribute('href');if(!raw||/^(?:https?:|mailto:|tel:)/.test(raw)&&!raw.startsWith(new URL(document.baseURI).origin))continue;let target;try{target=new URL(raw,document.baseURI)}catch{continue}
  const key=Object.keys(paths).find(k=>target.pathname.endsWith('/'+paths[k]));if(!key)continue;
  const destination=key==='home'&&legacy[target.hash.slice(1)]?legacy[target.hash.slice(1)]:key;
  if(destination!==key)target=new URL(url(destination));
  if(destination===current()&&target.hash)a.href=target.hash;else{target.searchParams.set('lang',window.LXL.lang);a.href=target.href}
  if(a.closest?.('.links,.platform-navigation,.body-site-menu')){if(destination===current())a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}
 }}
 window.LXLRoutes={paths,legacy,url,current,migrateLegacy,updateLinks};
 migrateLegacy();window.addEventListener?.('hashchange',migrateLegacy);document.addEventListener?.('lxl-language-change',updateLinks);
})();
