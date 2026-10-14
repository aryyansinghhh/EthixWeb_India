const crypto=require('crypto');const {env,sha,json,makeToken,sameOrigin,ipHash}=require('../_lib');
const fails=new Map(); // best-effort per-instance brute-force throttle
module.exports=async(req,res)=>{
  if(req.method==='DELETE'){res.setHeader('Set-Cookie','ew_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return json(res,200,{ok:true})}
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  if(!sameOrigin(req))return json(res,403,{error:'Forbidden'});
  try{
    const k=ipHash(req),f=fails.get(k)||{n:0,t:Date.now()};
    if(Date.now()-f.t>9e5){f.n=0;f.t=Date.now()}
    if(f.n>=5)return json(res,429,{error:'Too many attempts. Try again in 15 minutes.'});
    const pw=String((req.body||{}).password||'');
    if(!crypto.timingSafeEqual(sha(pw),sha(env('ADMIN_PASSWORD')))){f.n++;fails.set(k,f);return json(res,401,{error:'Incorrect password.'})}
    fails.delete(k);
    res.setHeader('Set-Cookie',`ew_admin=${makeToken()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
    return json(res,200,{ok:true});
  }catch(e){console.error(e.message);return json(res,500,{error:'Server misconfigured.'})}
};
