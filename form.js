(function(){
var f=document.getElementById('enqF'); if(!f)return;
var $=function(i){return document.getElementById(i)}, t0=Date.now(); $('ts').value=t0;
function msg(c,t){var m=$('fMsg');m.className='fmsg '+c;m.textContent=t;}
var sv=new URLSearchParams(location.search).get('service'); if(sv&&$('sv'))$('sv').value=sv;
f.addEventListener('submit',async function(e){
  e.preventDefault();
  var d={name:($('fn').value+' '+$('ln').value).trim(),email:$('em').value.trim(),phone:$('ph').value.trim(),service:$('sv').value,message:$('mg').value.trim(),website_url:$('hp').value,elapsed:Date.now()-t0};
  if(d.name.length<2){msg('err','Please enter your first name.');$('fn').focus();return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)){msg('err','Please enter a valid email address.');$('em').focus();return}
  if(d.phone&&!/^(\+?\d[\d\s\-()]{6,17})$/.test(d.phone)){msg('err','Phone looks invalid. Try +91 98765 43210.');$('ph').focus();return}
  if(!d.service){msg('err','Please select a service.');$('sv').focus();return}
  var b=$('fsubBtn'),o=b.innerHTML;b.disabled=true;b.innerHTML='Sending… <span>⟳</span>';
  try{
    var r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
    var j=await r.json().catch(function(){return{}});
    if(r.ok){msg('ok','✓ Enquiry received. We will reply within one business hour.');f.reset();t0=Date.now();}
    else msg('err',j.error||'Something went wrong. Please email info@ethixweb.com');
  }catch(x){msg('err','Network error. Please try again or email info@ethixweb.com');}
  finally{b.disabled=false;b.innerHTML=o;}
});})();
