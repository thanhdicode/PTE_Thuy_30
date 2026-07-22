(function(){'use strict';if(typeof ptemagicReferral==='undefined'){return}
var cfg=ptemagicReferral;var STORAGE_KEY=cfg.storageKey||'ptemagic_referral_v1';var TTL_MS=(parseInt(cfg.ttlDays,10)||30)*24*60*60*1000;var QUERY_KEYS=Array.isArray(cfg.queryKeys)&&cfg.queryKeys.length?cfg.queryKeys:['ref'];var POST_FIELD=cfg.postField||'ptemagic_referral_code';var defaults=cfg.defaultContact||{};var i18n=cfg.i18n||{};var activeReferral=null;function now(){return Date.now()}
function trim(value){return(value==null?'':String(value)).trim()}
function ensureAlertStyles(){if(document.getElementById('ptemagic-referral-alert-style')){return}
var style=document.createElement('style');style.id='ptemagic-referral-alert-style';style.textContent='#ptemagic-referral-alert{position:fixed;top:0;left:0;right:0;z-index:99999;background:#b42318;color:#fff;font-family:inherit;box-shadow:0 2px 12px rgba(0,0,0,.18)}'+'#ptemagic-referral-alert .ptemagic-ref-alert__inner{max-width:1100px;margin:0 auto;padding:12px 48px 12px 16px;position:relative;display:flex;gap:12px;align-items:flex-start}'+'#ptemagic-referral-alert .ptemagic-ref-alert__title{font-weight:700;margin:0 0 4px;font-size:14px}'+'#ptemagic-referral-alert .ptemagic-ref-alert__body{margin:0;font-size:13px;line-height:1.45;opacity:.95}'+'#ptemagic-referral-alert .ptemagic-ref-alert__code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:rgba(0,0,0,.2);padding:1px 6px;border-radius:4px}'+'#ptemagic-referral-alert .ptemagic-ref-alert__close{position:absolute;top:8px;right:10px;border:0;background:transparent;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;opacity:.85}'+'#ptemagic-referral-alert .ptemagic-ref-alert__close:hover{opacity:1}'+'body.ptemagic-referral-alert-visible{padding-top:64px}';document.head.appendChild(style)}
function dismissReferralAlert(){var el=document.getElementById('ptemagic-referral-alert');if(el&&el.parentNode){el.parentNode.removeChild(el)}
document.body.classList.remove('ptemagic-referral-alert-visible')}
function showReferralAlert(code,detail){ensureAlertStyles();dismissReferralAlert();var title=i18n.errorTitle||'Mã giới thiệu lỗi';var generic=i18n.errorGeneric||'Không xác thực được mã giới thiệu. Vui lòng báo về hệ thống để được hỗ trợ.';var closeLabel=i18n.errorClose||'Đóng';var message=trim(detail)||generic;var banner=document.createElement('div');banner.id='ptemagic-referral-alert';banner.setAttribute('role','alert');banner.innerHTML='<div class="ptemagic-ref-alert__inner">'+'<div>'+'<p class="ptemagic-ref-alert__title"></p>'+'<p class="ptemagic-ref-alert__body"></p>'+'</div>'+'<button type="button" class="ptemagic-ref-alert__close" aria-label=""></button>'+'</div>';banner.querySelector('.ptemagic-ref-alert__title').textContent=title;var bodyEl=banner.querySelector('.ptemagic-ref-alert__body');bodyEl.textContent='';if(code){var codeEl=document.createElement('span');codeEl.className='ptemagic-ref-alert__code';codeEl.textContent=code;bodyEl.appendChild(document.createTextNode('Mã '));bodyEl.appendChild(codeEl);bodyEl.appendChild(document.createTextNode(': '+message+' Hãy chụp màn hình và báo về hệ thống.'))}else{bodyEl.textContent=message+' Hãy chụp màn hình và báo về hệ thống.'}
var closeBtn=banner.querySelector('.ptemagic-ref-alert__close');closeBtn.setAttribute('aria-label',closeLabel);closeBtn.textContent='×';closeBtn.addEventListener('click',dismissReferralAlert);document.body.insertBefore(banner,document.body.firstChild);document.body.classList.add('ptemagic-referral-alert-visible')}
function readStorage(){try{var raw=window.localStorage.getItem(STORAGE_KEY);if(!raw){return null}
var parsed=JSON.parse(raw);if(!parsed||!parsed.code||!parsed.storedAt){window.localStorage.removeItem(STORAGE_KEY);return null}
if(now()-Number(parsed.storedAt)>TTL_MS){window.localStorage.removeItem(STORAGE_KEY);return null}
return parsed}catch(e){window.localStorage.removeItem(STORAGE_KEY);return null}}
function writeStorage(payload){try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify({code:payload.code,contact:payload.contact||{},storedAt:payload.storedAt||now(),}))}catch(e){}}
function clearStorage(){try{window.localStorage.removeItem(STORAGE_KEY)}catch(e){}}
function readRefFromUrl(){var params=new URLSearchParams(window.location.search);var i;for(i=0;i<QUERY_KEYS.length;i++){var value=trim(params.get(QUERY_KEYS[i]));if(value){return value.replace(/[^a-zA-Z0-9_-]/g,'')}}
return''}
function buildTelHref(phone){var cleaned=trim(phone).replace(/[^\d+]/g,'');return cleaned?'tel:'+cleaned:''}
function buildZaloHref(zalo){var cleaned=trim(zalo).replace(/[^\d]/g,'');return cleaned?'https://zalo.me/'+cleaned:''}
function normalizeMessengerHref(url,messengerId){var value=trim(url);if(value){if(/^https?:\/\//i.test(value)){return value}
if(/^m\.me\//i.test(value)){return'https://'+value}
if(/^facebook\.com\//i.test(value)){return'https://'+value}
return value}
var id=trim(messengerId);if(!id){return''}
if(/^https?:\/\//i.test(id)){return id}
return'https://m.me/'+encodeURIComponent(id)}
function fetchReferral(code){var url=(cfg.restUrl||'').replace(/\/$/,'')+'/'+encodeURIComponent(code);return fetch(url,{method:'GET',credentials:'same-origin',headers:{Accept:'application/json',},}).then(function(response){return response.json().then(function(body){return{ok:response.ok,body:body||{},}})})}
function formatContactLabel(name,number){if(name&&number){return name+' · '+number}
return number||name||''}
function toggleZaloItems(zalo){document.querySelectorAll('[data-ref-zalo-item]').forEach(function(el){if(zalo){el.classList.remove('is-hidden')}else{el.classList.add('is-hidden')}})}
function applyContactSwap(referral){if(!referral||!referral.contact){resetContactSwap();return}
var contact=referral.contact;var phone=trim(contact.phone)||trim(defaults.hotline);var zalo=trim(contact.zalo)||trim(defaults.zalo);var messenger=normalizeMessengerHref(contact.messenger,contact.messenger_id)||normalizeMessengerHref(defaults.messenger);var affiliateName=trim(contact.name);var phoneLabel=formatContactLabel(affiliateName,phone);var zaloLabel=formatContactLabel(affiliateName,zalo);document.querySelectorAll('[data-ref-contact="phone"]').forEach(function(el){var href=buildTelHref(phone);if(href){el.setAttribute('href',href)}
var label=el.querySelector('[data-ref-label]')||el.querySelector('span');if(label&&phone){label.textContent=phone}});document.querySelectorAll('[data-ref-contact="zalo"]').forEach(function(el){var href=buildZaloHref(zalo);if(href){el.setAttribute('href',href)}});document.querySelectorAll('[data-ref-contact="messenger"]').forEach(function(el){var href=normalizeMessengerHref(messenger);if(href){el.setAttribute('href',href)}});document.querySelectorAll('[data-ref-contact="text_mess_desktop"]').forEach(function(el){if(affiliateName){el.textContent='Tư vấn cùng '+affiliateName}});document.querySelectorAll('[data-ref-contact="text_mess_mobile"]').forEach(function(el){if(affiliateName){el.textContent=affiliateName}else if(defaults.text_mess_mobile){el.textContent=defaults.text_mess_mobile}});document.querySelectorAll('[data-ref-contact="text_phone_desktop"]').forEach(function(el){if(phoneLabel){el.textContent=phoneLabel}});document.querySelectorAll('[data-ref-contact="text_zalo_desktop"], [data-ref-contact="text_zalo_mobile"]').forEach(function(el){if(zaloLabel){el.textContent=zaloLabel}});document.querySelectorAll('[data-ref-contact="hotline"]').forEach(function(el){if(phone){el.textContent=phone}});toggleZaloItems(zalo);document.body.classList.add('referral-active');document.body.setAttribute('data-referral-code',referral.code||'')}
function resetContactSwap(){toggleZaloItems(trim(defaults.zalo));document.body.classList.remove('referral-active');document.body.removeAttribute('data-referral-code')}
function injectReferralIntoForms(code){if(!code){return}
document.querySelectorAll('form.wpforms-form').forEach(function(form){var input=form.querySelector('input[name="'+POST_FIELD+'"]');if(!input){input=document.createElement('input');input.type='hidden';input.name=POST_FIELD;form.appendChild(input)}
input.value=code})}
function setActiveReferral(payload){activeReferral=payload;if(payload&&payload.code){writeStorage(payload);applyContactSwap(payload);injectReferralIntoForms(payload.code)}else{clearStorage();resetContactSwap()}}
function validateAndApply(code,options){options=options||{};code=trim(code).replace(/[^a-zA-Z0-9_-]/g,'');if(!code){if(options.clearOnFail){setActiveReferral(null)}
return Promise.resolve(null)}
return fetchReferral(code).then(function(result){if(result.ok&&result.body&&result.body.valid){dismissReferralAlert();var payload={code:result.body.code||code,contact:result.body.contact||{},storedAt:now(),};setActiveReferral(payload);return payload}
if(options.clearOnFail){setActiveReferral(null)}
if(options.alertOnFail){var detail=result.body&&result.body.message?String(result.body.message):(i18n.errorGeneric||'');showReferralAlert(code,detail)}
return null}).catch(function(){if(options.clearOnFail){setActiveReferral(null)}
if(options.alertOnFail){showReferralAlert(code,i18n.errorGeneric||'')}
return null})}
function bootstrap(){var urlCode=readRefFromUrl();var stored=readStorage();if(urlCode){validateAndApply(urlCode,{clearOnFail:!1,alertOnFail:!0}).then(function(payload){if(!payload&&stored&&stored.code===urlCode){setActiveReferral(stored)}});return}
if(stored&&stored.code){setActiveReferral(stored);validateAndApply(stored.code,{clearOnFail:!0,alertOnFail:!1});return}
injectReferralIntoForms('')}
function bindDynamicForms(){document.addEventListener('wpformsReady',function(){if(activeReferral&&activeReferral.code){injectReferralIntoForms(activeReferral.code)}});if(window.jQuery){window.jQuery(document).on('wpformsFormLoaded wpformsReady',function(){if(activeReferral&&activeReferral.code){injectReferralIntoForms(activeReferral.code)}})}
document.addEventListener('submit',function(event){var form=event.target;if(!form||!form.classList||!form.classList.contains('wpforms-form')){return}
if(activeReferral&&activeReferral.code){injectReferralIntoForms(activeReferral.code)}},!0)}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',bootstrap)}else{bootstrap()}
bindDynamicForms()})()