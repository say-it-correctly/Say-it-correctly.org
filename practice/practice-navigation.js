/* Keep this practice CTA aligned with the Games catalogue after each locale refresh. */
(()=>{'use strict';
 const labels={en:'Games and practice','zh-CN':'游戏与练习',fr:'Jeux et pratique',pt:'Jogos e prática',es:'Juegos y práctica'};
 function update(){const link=document.getElementById('body-link');if(!link)return;
  const lang=window.LXL?.lang||new URLSearchParams(location.search).get('lang')||'en';
  link.textContent=labels[lang]||labels.en;
  link.href=window.LXLRoutes?.url('games')||('../games/index.html?lang='+encodeURIComponent(lang));
 }
 document.addEventListener('lxl-language-change',update);
 update();
})();
