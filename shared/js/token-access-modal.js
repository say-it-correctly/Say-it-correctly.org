(()=>{'use strict';
 const C=window.SICCommerce,config=window.SIC_CONFIG||{};
 if(!C||config.tokenAccessEnabled!==true)return;
 const originalAccess=C.mountAccess,originalRequest=C.mountRequest,originalApi=C.api,originalBootstrap=C.bootstrap;
 const scriptURL=document.currentScript?.src||location.href;
 const logoURL=new URL('../assets/logo-oficial-say-it-correctly.png',scriptURL).href;
 let loginReceipt=null,requestReceipt=null,restartReceipt=null;
 const sessionKey='sic-paid-session-v1';
 const forgetSession=()=>{try{sessionStorage.removeItem(sessionKey)}catch{}};
 function acceptSession(result){
  if(result.paid!==true||!result.token||!result.nonce||!Array.isArray(result.completed))throw Error('invalid_paid_session');
  C.current={...result,paid:true,authMethod:'commercial-token'};
  // Persist only the short-lived exercise capability, never the email/access token.
  try{sessionStorage.setItem(sessionKey,JSON.stringify({token:result.token,expiresAt:result.expiresAt}))}catch{}
  return C.current;
 }
 async function commercialAPI(path,body,{key,token}={}){
  const base=new URL(config.apiBase);
  if(base.protocol!=='https:'&&!(base.protocol==='http:'&&['127.0.0.1','localhost'].includes(base.hostname)))throw Error('unsafe_api');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(config.apiBase+path,{method:body?'POST':'GET',credentials:'omit',cache:'no-store',headers:{...(body?{'content-type':'application/json'}:{}),...(key?{'idempotency-key':key}:{}),...(token?{'x-exercise-token':token}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
   const result=await response.json();if(!response.ok)throw Object.assign(Error(result.error||'unavailable'),{code:result.error,httpStatus:response.status});return result;
  }finally{clearTimeout(timer)}
 }
 C.api=(path,body,options={})=>C.current?.authMethod==='commercial-token'&&path==='/attempt'?commercialAPI(path,body,options).catch(async error=>{if(error.code==='round_changed'){await C.commercialStatus();document.dispatchEvent(new CustomEvent('sic-session-started',{detail:C.current}));}throw error;}):originalApi(path,body,options);
 C.loginWithToken=async(email,token,captchaToken,{refreshCaptcha}={})=>{
  const normalized=email.trim().toLowerCase(),secret=token.trim();
  const trialToken=C.current&&!C.current.paid&&(!C.current.expiresAt||C.current.expiresAt>Date.now())?C.current.token:null;
  const signature=JSON.stringify([normalized,secret,trialToken]);
  if(loginReceipt?.signature!==signature)loginReceipt={signature,key:crypto.randomUUID()};
  let result;
  try{result=await commercialAPI('/token-session',{email:normalized,token:secret,captchaToken,...(trialToken?{trialToken}:{})},{key:loginReceipt.key});}
  catch(error){if(error.code!=='invalid_trial_transfer'||!trialToken||!refreshCaptcha)throw error;loginReceipt={signature,key:crypto.randomUUID()};const freshCaptcha=await refreshCaptcha();result=await commercialAPI('/token-session',{email:normalized,token:secret,captchaToken:freshCaptcha},{key:loginReceipt.key});}
  loginReceipt=null;return acceptSession(result);
 };
 C.commercialStatus=async(credential=C.current?.token)=>{
  try{return acceptSession(await commercialAPI('/token-session',null,{token:credential}));}
  catch(error){if(error.httpStatus===401||error.httpStatus===403)forgetSession();throw error;}
 };
 C.bootstrap=async()=>{
  const initial=await originalBootstrap();let saved;
  try{saved=JSON.parse(sessionStorage.getItem(sessionKey)||'null')}catch{forgetSession();}
  if(!saved)return initial;
  if(!/^[A-Za-z0-9_-]{43}$/.test(saved.token||'')||!Number.isFinite(saved.expiresAt)||saved.expiresAt<=Date.now()){forgetSession();return initial;}
  try{return await C.commercialStatus(saved.token)}catch(error){if(error.httpStatus===401||error.httpStatus===403)return initial;throw error;}
 };
 C.restartCommercial=async()=>{
  if(C.current?.authMethod!=='commercial-token')throw Object.assign(Error('permission_required'),{code:'permission_required'});
  const credential=C.current.token,nonce=C.current.nonce;
  if(restartReceipt?.credential!==credential||restartReceipt.nonce!==nonce)restartReceipt={credential,nonce,key:crypto.randomUUID()};
  try{const session=acceptSession(await commercialAPI('/token-session/restart',{nonce},{key:restartReceipt.key,token:credential}));restartReceipt=null;return session;}
  catch(error){if(error.code==='round_changed'||error.code==='nonce_reused'){await C.commercialStatus();document.dispatchEvent(new CustomEvent('sic-session-started',{detail:C.current}));}if(error.httpStatus===401||error.httpStatus===403)forgetSession();throw error;}
 };
 C.logoutCommercial=async()=>{if(C.current?.authMethod==='commercial-token')await commercialAPI('/token-session/logout',{}, {token:C.current.token});forgetSession();C.current=null;loginReceipt=null;restartReceipt=null;};
 C.submitCommercialRequest=async(fields,captchaToken)=>{
  const payload={...fields,kind:'access',lang:window.LXL?.lang||'es',consentVersion:config.privacyVersion,termsVersion:config.termsVersion,captchaToken,...(C.current&&!C.current.paid&&C.current.token?{trialToken:C.current.token}:{})};
  const signature=JSON.stringify({...payload,captchaToken:null});
  if(requestReceipt?.signature!==signature){const result=await commercialAPI('/requests',payload);if(result.received!==true||typeof result.id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(result.id))throw Error('invalid_request_receipt');requestReceipt={signature,id:result.id};}
  const number=config.whatsappNumber;
  if(number!=='573058947808')throw Error('whatsapp_destination_not_approved');
  const message='Hola Iván. Mi solicitud de Say It Correctly es '+requestReceipt.id+'. '+fields.message+'\nPago USD 1 pendiente de confirmación manual. Correo: '+fields.email;
  return {id:requestReceipt.id,url:'https://wa.me/'+number+'?text='+encodeURIComponent(message)};
 };
 function mount(container,onAccess,initialMode='token'){
  const host=container.closest('.dialog');host?.classList.remove('tutorial-dialog','sic-access-dialog','sic-trial-dialog');host?.classList.add('sic-token-modal');container.classList.remove('sic-access-content','sic-trial-content','sic-request-content');
  const template=document.createElement('template');
  template.innerHTML=window.SIC_TOKEN_MODAL_TEMPLATE;
  for(const img of template.content.querySelectorAll('img'))img.src=logoURL;
  container.replaceChildren(template.content.cloneNode(true));
  const q=name=>container.querySelector('[data-sic-control="'+name+'"]');
  const tokenForm=q('tokenForm'),requestForm=q('requestForm'),status=q('status'),whatsapp=q('commercial-whatsapp');
  for(const img of container.querySelectorAll('img'))img.src=logoURL;
  for(const a of container.querySelectorAll('a')){if(a.getAttribute('href')==='__PRIVACY_URL__')a.href=config.privacyUrl;if(a.getAttribute('href')==='__TERMS_URL__')a.href=config.termsUrl;}
  let busy=false;
  const announce=(message,error=false)=>{status.textContent=message;status.hidden=false;status.dataset.state=error?'error':'info';};
  const setMode=mode=>{if(busy)return;const request=mode==='request';tokenForm.hidden=request;requestForm.hidden=!request;q('tokenMode').setAttribute('aria-pressed',String(!request));q('requestMode').setAttribute('aria-pressed',String(request));container.querySelector('#dialog-title').textContent=request?'Solicita tu acceso':'Continúa tu práctica';q('lead').textContent=request?'Registra tus datos para coordinar con Iván el pago y recibir tu token.':'Introduce el correo de tu solicitud y el token que recibiste.';status.hidden=true;const overlay=document.getElementById('overlay');if(overlay)overlay.scrollTop=0;};
  q('tokenMode').onclick=()=>setMode('token');q('requestMode').onclick=()=>setMode('request');q('sic-commercial-close').onclick=()=>document.getElementById('close')?.click();
  const message=error=>error.code==='access_invalid'?'No se pudo validar el acceso. Comprueba el correo y el token, o contacta con Iván.':error.code==='rate_limited'?'Se alcanzó el límite temporal de intentos. Vuelve a intentarlo más tarde.':error.code==='capacity_exhausted'?'No hay activaciones disponibles. Contacta con Iván.':error.code==='invalid_trial_transfer'?'La sesión gratuita ya no permite transferir el progreso. Recarga la página y vuelve a intentarlo.':'No se pudo completar la operación. Conservamos tu sesión; vuelve a intentarlo.';
  async function run(button,task){if(busy)return;if(config.privacyApproved!==true){announce('El acceso no está habilitado.',true);return;}busy=true;button.disabled=true;container.setAttribute('aria-busy','true');announce('Comprobando tu solicitud…');try{await task();}catch(error){announce(message(error),true);}finally{busy=false;button.disabled=false;container.removeAttribute('aria-busy');}}
  tokenForm.onsubmit=event=>{event.preventDefault();if(!tokenForm.reportValidity())return;return run(q('enter'),async()=>{const captcha=await C.captcha(q('commercial-captcha'));const session=await C.loginWithToken(tokenForm.elements.email.value,tokenForm.elements.accessToken.value,captcha,{refreshCaptcha:()=>C.captcha(q('commercial-captcha'))});tokenForm.elements.accessToken.value='';announce('Acceso verificado. Abriendo práctica…');onAccess(session);});};
  requestForm.onsubmit=event=>{event.preventDefault();if(!requestForm.reportValidity())return;return run(q('register'),async()=>{
   if(config.requestsEnabled!==true)throw Error('requests_disabled');
   const e=requestForm.elements,fields={name:e.name.value.trim(),phone:e.phone.value.trim(),email:e.email.value.trim(),message:e.message.value.trim(),consent:e.consent.checked,termsAccepted:e.termsAccepted.checked};
   const result=await C.submitCommercialRequest(fields,await C.captcha(q('commercial-captcha')));whatsapp.href=result.url;whatsapp.hidden=false;
   // The registered receipt gates opening the WhatsApp draft; no sending is claimed.
   window.open(result.url,'_blank','noopener,noreferrer');
   announce('Solicitud registrada: '+result.id+'. Se intentó abrir WhatsApp. Si no abrió, pulsa Abrir WhatsApp de Iván. Debes enviar el mensaje allí; la recepción y el pago no están confirmados.');
  });};
  // Names preserve the approved legal controls while preventing duplicate document IDs.
  requestForm.querySelectorAll('input[type="checkbox"]')[0].name='consent';requestForm.querySelectorAll('input[type="checkbox"]')[1].name='termsAccepted';
  setMode(initialMode);
  requestAnimationFrame(()=>{if(container.isConnected)q('sic-commercial-close').focus({preventScroll:true});});
 }
 C.mountAccess=(container,onAccess,options={})=>options.allowTrial?originalAccess(container,onAccess,options):mount(container,onAccess,'token');
 C.mountRequest=container=>mount(container,session=>{C.completePracticeStart?.();document.dispatchEvent(new CustomEvent('sic-access-granted',{detail:session}));},'request');
 // Cover both game-owned dialogs and the independent token-entry button.
 const host=document.getElementById('dialog'),overlay=document.getElementById('overlay');
 let viewportState=null;
 function syncCommercialViewport(){
  const open=!!overlay?.classList.contains('open'),commercial=open&&host?.classList.contains('sic-token-modal');
  if(!open&&host?.classList.contains('sic-token-modal'))host.classList.remove('sic-token-modal');
  if(commercial&&!viewportState){
   const html=document.documentElement,body=document.body,props=['position','top','left','right','width'];
   viewportState={x:window.scrollX,y:window.scrollY,overflow:html.style.overflow,scrollBehavior:html.style.scrollBehavior,body:Object.fromEntries(props.map(p=>[p,body.style[p]])),inert:[]};
   html.classList.add('sic-commercial-open');html.style.overflow='hidden';
   body.style.position='fixed';body.style.top=-viewportState.y+'px';body.style.left=-viewportState.x+'px';body.style.right='0';body.style.width='100%';
   for(const element of document.querySelectorAll('body>header,body>main,body>.intro,body>footer,body>[data-ui="demo"]'))if(!element.inert){element.inert=true;viewportState.inert.push(element);}
  }else if(!commercial&&viewportState){
   const previous=viewportState;viewportState=null;
   for(const [prop,value]of Object.entries(previous.body))document.body.style[prop]=value;
   document.documentElement.style.overflow=previous.overflow;document.documentElement.classList.remove('sic-commercial-open');
   if(!open)for(const element of previous.inert)element.inert=false;
   document.documentElement.style.scrollBehavior='auto';window.scrollTo(previous.x,previous.y);document.documentElement.style.scrollBehavior=previous.scrollBehavior;
  }
 }
 if(host&&overlay){const observer=new MutationObserver(syncCommercialViewport);observer.observe(overlay,{attributes:true,attributeFilter:['class']});observer.observe(host,{attributes:true,attributeFilter:['class']});syncCommercialViewport();}
})();
