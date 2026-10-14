const crypto=require('crypto');
const SERVICES=['Website Redesign','AI Receptionist / CSR','Google Ads + LSA','SEO','CRM Integration','Web Application','LLM Chatbot','Meta Ads','Email Marketing','Dashboard & Analytics','Maintenance & Support','Full Digital Operations',"Not sure — let's talk"];
const STATUSES=['new','contacted','qualified','closed'];
const env=k=>{const v=process.env[k];if(!v)throw new Error('Missing env '+k);return v};
const sha=s=>crypto.createHash('sha256').update(s).digest();
function json(res,code,obj){res.setHeader('Cache-Control','no-store');res.status(code).json(obj)}
function ip(req){return String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'').split(',')[0].trim()}
const ipHash=req=>crypto.createHash('sha256').update(ip(req)+env('SESSION_SECRET')).digest('hex').slice(0,32);
async function sb(path,opt={}){
  const r=await fetch(env('SUPABASE_URL')+'/rest/v1/'+path,{...opt,headers:{apikey:env('SUPABASE_SERVICE_KEY'),Authorization:'Bearer '+env('SUPABASE_SERVICE_KEY'),'Content-Type':'application/json',...(opt.headers||{})}});
  if(!r.ok)throw new Error('Supabase '+r.status+': '+(await r.text()).slice(0,200));
  return r.status===204?null:r.json().catch(()=>null);
}
const sign=p=>crypto.createHmac('sha256',env('SESSION_SECRET')).update(p).digest('base64url');
function makeToken(){const p=Buffer.from(JSON.stringify({exp:Date.now()+8*3600e3})).toString('base64url');return p+'.'+sign(p)}
function validToken(t){
  if(!t||!t.includes('.'))return false;const [p,s]=t.split('.');
  const a=Buffer.from(s),b=Buffer.from(sign(p));
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return false;
  try{return JSON.parse(Buffer.from(p,'base64url').toString()).exp>Date.now()}catch{return false}
}
function cookie(req,name){const m=(req.headers.cookie||'').match(new RegExp('(?:^|; )'+name+'=([^;]*)'));return m?m[1]:''}
function isAdmin(req){return validToken(cookie(req,'ew_admin'))}
function sameOrigin(req){const o=req.headers.origin;return !o||new URL(o).host===req.headers.host}
const clean=(s,n)=>String(s??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,n);
module.exports={SERVICES,STATUSES,env,sha,json,ipHash,sb,makeToken,isAdmin,sameOrigin,clean};
