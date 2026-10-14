(function(){
var $=function(i){return document.getElementById(i)},all=[];
function api(m,u,b){return fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined,credentials:'same-origin'}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok){var e=new Error(j.error||'Request failed');e.status=r.status;throw e}return j})})}
function show(on){$('login').hidden=on;$('dash').hidden=!on}
function el(t,txt,c){var e=document.createElement(t);if(txt!=null)e.textContent=txt;if(c)e.className=c;return e}
function render(){
  var q=$('q').value.toLowerCase(),s=$('fl').value,tb=$('rows');tb.textContent='';
  var rows=all.filter(function(l){return(!s||l.status===s)&&(!q||[l.name,l.email,l.service,l.message,l.phone].join(' ').toLowerCase().indexOf(q)>-1)});
  $('cnt').textContent=rows.length;$('tot').textContent=all.length;$('empty').hidden=rows.length>0;
  rows.forEach(function(l){
    var tr=el('tr',null,l.status==='new'?'lt-new':'');
    tr.appendChild(el('td',new Date(l.created_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})));
    tr.appendChild(el('td',l.name));
    var c=el('td');var a=el('a',l.email);a.href='mailto:'+l.email;c.appendChild(a);if(l.phone){c.appendChild(document.createElement('br'));c.appendChild(el('span',l.phone))}tr.appendChild(c);
    tr.appendChild(el('td',l.service));tr.appendChild(el('td',l.message||'—','m'));
    var td=el('td'),sel=document.createElement('select');['new','contacted','qualified','closed'].forEach(function(v){var o=el('option',v);o.value=v;if(v===l.status)o.selected=true;sel.appendChild(o)});
    sel.onchange=function(){api('PATCH','/api/admin/leads',{id:l.id,status:sel.value}).then(function(){l.status=sel.value;render()}).catch(function(e){alert(e.message)})};td.appendChild(sel);tr.appendChild(td);
    var d=el('td'),b=el('button','Delete','adm-btn danger');b.type='button';b.onclick=function(){if(confirm('Delete this lead permanently?'))api('DELETE','/api/admin/leads?id='+l.id).then(load).catch(function(e){alert(e.message)})};d.appendChild(b);tr.appendChild(d);
    tb.appendChild(tr)});
}
function load(){return api('GET','/api/admin/leads').then(function(j){all=j.leads||[];show(true);render()}).catch(function(e){if(e.status===401)show(false);else alert(e.message)})}
$('lf').onsubmit=function(e){e.preventDefault();var m=$('almsg');m.className='adm-msg';
  api('POST','/api/admin/login',{password:$('apw').value}).then(function(){$('apw').value='';return load()}).catch(function(x){m.textContent=x.message;m.className='adm-msg show'})};
$('out').onclick=function(){api('DELETE','/api/admin/login').finally(function(){all=[];show(false)})};
$('q').oninput=$('fl').onchange=render;
$('exp').onclick=function(){
  var esc=function(v){v=String(v==null?'':v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
  var csv=['Date,Name,Email,Phone,Service,Message,Status'].concat(all.map(function(l){return[l.created_at,l.name,l.email,l.phone,l.service,l.message,l.status].map(esc).join(',')})).join('\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='ethixweb-leads.csv';a.click()};
load();})();
