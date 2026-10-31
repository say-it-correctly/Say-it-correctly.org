/* Page-local labels. Never recreate the iframe or reset playback on a locale change. */
(()=>{'use strict';
 const copy={
  en:{title:'Video library',intro:'Watch the channel’s welcome video here, or continue exploring on YouTube.',description:'Welcome video published by Say-it-correctly. org, introducing its invitation to learn English.',watch:'Watch on YouTube',help:'If the player is unavailable here, use the YouTube link above.',player:'YouTube player'},
  'zh-CN':{title:'视频库',intro:'在这里观看频道的欢迎视频，或前往 YouTube 继续探索。',description:'由 Say-it-correctly. org 发布的欢迎视频，邀请大家学习英语。',watch:'在 YouTube 上观看',help:'如果此处无法使用播放器，请使用上方的 YouTube 链接。',player:'YouTube 播放器'},
  fr:{title:'Vidéothèque',intro:'Regardez ici la vidéo de bienvenue de la chaîne, ou poursuivez votre découverte sur YouTube.',description:'Vidéo de bienvenue publiée par Say-it-correctly. org, qui invite à apprendre l’anglais.',watch:'Regarder sur YouTube',help:'Si le lecteur est indisponible ici, utilisez le lien YouTube ci-dessus.',player:'Lecteur YouTube'},
  pt:{title:'Videoteca',intro:'Assista aqui ao vídeo de boas-vindas do canal ou continue explorando no YouTube.',description:'Vídeo de boas-vindas publicado por Say-it-correctly. org, com um convite para aprender inglês.',watch:'Assistir no YouTube',help:'Se o reprodutor estiver indisponível aqui, use o link do YouTube acima.',player:'Reprodutor do YouTube'},
  es:{title:'Videoteca',intro:'Mira aquí el video de bienvenida del canal o continúa explorando en YouTube.',description:'Video de bienvenida publicado por Say-it-correctly. org, con su invitación a aprender inglés.',watch:'Ver en YouTube',help:'Si el reproductor no está disponible aquí, utiliza el enlace de YouTube de arriba.',player:'Reproductor de YouTube'}
 };
 function render(){const t=copy[LXL.lang],map={'video-library-title':'title','video-library-intro':'intro','official-video-description':'description','official-video-watch':'watch','official-video-help':'help'};for(const [id,key]of Object.entries(map)){const e=document.getElementById(id);if(e)e.textContent=t[key]}const player=document.getElementById('official-video-player'),title=document.getElementById('official-video-title');if(player&&title)player.title=t.player+': '+title.textContent}
 document.addEventListener('lxl-language-change',render);render();
})();
