// Public entry point. Answer data and evaluation remain on sic-commerce.
(async()=>{'use strict';const C=window.SICCommerce;
 if(!window.SIC_CONFIG?.privacyApproved||!await C.practiceReady){document.getElementById('status').textContent=C.text('failed');return;}
 const script=document.createElement('script');script.src='js/app-secure.js';script.onerror=()=>{document.getElementById('status').textContent=C.text('failed');};document.head.append(script);
})();
