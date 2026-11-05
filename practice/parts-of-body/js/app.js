// Public entry point. Answer data and evaluation remain on sic-commerce.
(async()=>{'use strict';const C=window.SICCommerce,root=document.documentElement;
 let timer;
 const entry=window.SICEntry={failed:false,
  present(){if(!this.failed){clearTimeout(timer);root.dataset.sicEntry='pending';}},
  release(){if(!this.failed){clearTimeout(timer);root.removeAttribute('data-sic-entry');document.getElementById('sic-entry-status')?.remove();}},
  fail(message){this.failed=true;clearTimeout(timer);root.dataset.sicEntry='error';root.classList.remove('modal-open');document.getElementById('overlay')?.classList.remove('open');document.querySelector('.language-welcome')?.remove();const status=document.getElementById('sic-entry-status');status.setAttribute('role','alert');document.getElementById('sic-entry-message').textContent=message||'No se pudo cargar la practica. Vuelve a intentarlo. / Practice could not load. Please retry.';const retry=document.getElementById('sic-entry-retry');retry.hidden=false;retry.focus();}
 };
 timer=setTimeout(()=>entry.fail(),20000);
 try{
  if(!window.SIC_CONFIG?.privacyApproved||!await C.practiceReady){entry.fail(C?.text?.('failed'));return;}
  if(entry.failed)return;
  const script=document.createElement('script');script.src='js/app-secure.js';script.onerror=()=>entry.fail(C?.text?.('failed'));document.head.append(script);
 }catch{entry.fail(C?.text?.('failed'));}
})();
