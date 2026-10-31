/* Shared audio, no services. Call directly inside the learner's interaction.
   playError() never queues effects; speakEnglish() uses cached English voices. */
(()=>{'use strict';
 const successURL=document.currentScript?.src?new URL('../assets/audio/correct-sound.mp3',document.currentScript.src).href:null;
 let successEffect=null,successSequence=0;
 function stopSuccess(){successSequence++;if(successEffect){successEffect.pause();successEffect.currentTime=0}}
 function playSuccess(){
  const request=++successSequence;stopSpeech();
  try{source?.stop();source=null;if(effect){effect.pause();effect.currentTime=0}
   if(!successEffect){if(!successURL)throw Error('Missing audio manager URL');successEffect=new window.Audio(successURL);successEffect.preload='auto';successEffect.volume=.55;}
   successEffect.pause();successEffect.currentTime=0;
   return Promise.resolve(successEffect.play()).then(()=>true).catch(error=>{if(request!==successSequence&&error.name==='AbortError')return false;notify({code:'successEffectFail',cause:error});return false});
  }catch(error){notify({code:'successEffectFail',cause:error});return Promise.resolve(false)}
 }
 const listeners=new Set(),voiceListeners=new Set();
 const genders={female:/\b(female|woman|samantha|zira|aria|jenny|victoria|susan|karen|moira)\b/i,male:/\b(male|man|david|mark|guy|daniel|alex|george|fred)\b/i};
 let voices=[],active=null,timer=null,effect=null,context=null,buffer=null,source=null,loading=null,sequence=0,lastError=null;
 const notify=error=>{lastError=error;console.warn('[SayIt audio]',error.code,error.cause||'');listeners.forEach(fn=>fn(error))};
 function refreshVoices(){try{voices=(window.speechSynthesis?.getVoices()||[]).filter(v=>/^en(?:[-_]|$)/i.test(v.lang)).sort((a,b)=>Number(b.localService)-Number(a.localService)||rank(a)-rank(b))}catch(error){voices=[];notify({code:'voiceFail',cause:error})}voiceListeners.forEach(fn=>fn());return voices}
 const rank=v=>/^en[-_]US$/i.test(v.lang)?0:/^en[-_]GB$/i.test(v.lang)?1:2;
 // SpeechSynthesisVoice has no standard gender field. Names are hints only;
 // conflicting or unrecognized names must never be labelled as a known gender.
 function voiceGender(voice){if(!voice||!/^en(?:[-_]|$)/i.test(voice.lang))return null;const female=genders.female.test(voice.name),male=genders.male.test(voice.name);return female===male?null:female?'female':'male'}
 function voiceFor(gender){return (gender&&voices.find(v=>voiceGender(v)===gender))||voices[0]||null}
 function voiceFallback(gender,voice=voiceFor(gender)){return !voice?'voiceDefault':!voiceGender(voice)?'voiceUnknown':gender&&voiceGender(voice)!==gender?'voiceFallback':null}
 function stopSpeech(){clearTimeout(timer);timer=null;const previous=active;active=null;const synth=window.speechSynthesis;if(synth&&(previous||synth.pending||synth.speaking))synth.cancel()}
 function speakEnglish(text,{gender,onstart=()=>{},onend=()=>{},onerror=()=>{}}={}){
  stopSuccess();
  const synth=window.speechSynthesis,Utterance=window.SpeechSynthesisUtterance;
  if(!synth||!Utterance){onerror({code:'voiceUnsupported'});return false}
  // Initialization and voiceschanged maintain the inventory, including an empty
  // one. Never query the engine or notify inventory listeners on the click path.
  const voice=voiceFor(gender);
  // Never wait outside the user gesture or replay on voiceschanged. An empty
  // inventory is normal during startup; the engine can resolve en-US itself.
  stopSpeech();const u=new Utterance(text);active=u;if(voice)u.voice=voice;u.lang=voice?.lang||'en-US';u.rate=.95;u.pitch=1;u.volume=1;
  const fail=error=>{if(active!==u)return;clearTimeout(timer);timer=null;active=null;onerror(error)};
  u.onstart=()=>{if(active!==u)return;clearTimeout(timer);timer=null;onstart({text,voice,genderHint:voiceGender(voice),fallback:voiceFallback(gender,voice)})};
  u.onend=()=>{if(active!==u)return;clearTimeout(timer);timer=null;active=null;onend()};
  u.onerror=e=>fail({code:'voiceFail',detail:e.error});
  // Watchdog detects a stalled engine; it does not delay speak().
  timer=setTimeout(()=>{if(active!==u)return;stopSpeech();onerror({code:'voiceTimeout'})},8000);
  try{if(synth.paused)synth.resume();synth.speak(u);return true}catch(error){fail({code:'voiceFail',detail:error.name});return false}
 }
 function initEffects(){if(effect)return effect;effect=document.getElementById('error-sound');if(!effect)return null;effect.preload='auto';effect.volume=.55;effect.addEventListener('error',()=>notify({code:'effectFail',cause:effect.error}));try{effect.load()}catch(error){notify({code:'effectFail',cause:error})}return effect}
 function warmEffects(event){
  // Pronunciation uses speech synthesis, not the error MP3 or AudioContext.
  if(event?.target?.closest?.('.speak,#speak,#voice-test'))return;
  const a=initEffects();if(!a)return;
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!context)context=new C();if(context.state==='suspended')context.resume().catch(error=>notify({code:'effectPrepare',cause:error}));
   if(!loading){loading=fetch(a.src).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.arrayBuffer()}).then(bytes=>context.decodeAudioData(bytes)).then(decoded=>{buffer=decoded}).catch(error=>notify({code:'effectPrepare',cause:error}))}
  }catch(error){notify({code:'effectPrepare',cause:error})}
 }
 function playError(){stopSuccess();warmEffects();const request=++sequence,a=initEffects();
  try{source?.stop();source=null;if(a){a.pause();a.currentTime=0}
   if(buffer&&context?.state==='running'){source=context.createBufferSource();source.buffer=buffer;const gain=context.createGain();gain.gain.value=.55;source.connect(gain).connect(context.destination);source.start(0);return Promise.resolve(true)}
   if(!a)throw Error('Missing error-sound element');
   return Promise.resolve(a.play()).then(()=>true).catch(error=>{if(request!==sequence&&error.name==='AbortError')return false;notify({code:'effectFail',cause:error});return false});
  }catch(error){notify({code:'effectFail',cause:error});return Promise.resolve(false)}
 }
 window.LXLAudio={playSuccess,initEffects,warmEffects,playError,speakEnglish,stopSpeech,refreshVoices,voiceFor,voiceGender,voiceFallback,get voices(){return voices},onError(fn){listeners.add(fn);if(lastError)fn(lastError);return()=>listeners.delete(fn)},onVoicesChanged(fn){voiceListeners.add(fn);return()=>voiceListeners.delete(fn)}};
 window.speechSynthesis?.addEventListener?.('voiceschanged',refreshVoices);refreshVoices();initEffects();
 document.addEventListener?.('pointerdown',warmEffects,{once:true,capture:true});document.addEventListener?.('keydown',warmEffects,{once:true,capture:true});
})();
