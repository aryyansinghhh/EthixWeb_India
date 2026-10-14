const {SERVICES,json,ipHash,sb,sameOrigin,clean}=require('./_lib');
const EMAIL=/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;
module.exports=async(req,res)=>{
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{error:'Method not allowed'})}
  if(!sameOrigin(req))return json(res,403,{error:'Forbidden'});
  try{
    const b=typeof req.body==='object'&&req.body?req.body:{};
    // Spam layer 1: honeypot (reply 200 so bots think it worked) + minimum fill time
    if(clean(b.website_url,50)||Number(b.elapsed)<2500)return json(res,200,{ok:true});
    const d={name:clean(b.name,80),email:clean(b.email,254).toLowerCase(),phone:clean(b.phone,25),service:clean(b.service,60),message:clean(b.message,2000)};
    if(d.name.length<2)return json(res,422,{error:'Please enter your name.'});
    if(!EMAIL.test(d.email))return json(res,422,{error:'Please enter a valid email address.'});
    if(d.phone&&!/^\+?\d[\d\s\-()]{6,17}$/.test(d.phone))return json(res,422,{error:'Please enter a valid phone number.'});
    if(!SERVICES.includes(d.service))return json(res,422,{error:'Please select a service.'});
    if(/https?:\/\/.*https?:\/\//i.test(d.message))return json(res,200,{ok:true}); // link-stuffing = spam
    // Spam layer 2: DB-backed rate limit (max 5 enquiries / IP / hour; survives serverless cold starts)
    const h=ipHash(req),since=new Date(Date.now()-3600e3).toISOString();
    const recent=await sb(`leads?select=id&ip_hash=eq.${h}&created_at=gte.${since}`);
    if((recent||[]).length>=5)return json(res,429,{error:'Too many enquiries. Please try again later or email info@ethixweb.com'});
    await sb('leads',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({...d,ip_hash:h,user_agent:clean(req.headers['user-agent'],200)})});
    return json(res,201,{ok:true});
  }catch(e){console.error('lead error',e.message);return json(res,500,{error:'Could not save your enquiry. Please email info@ethixweb.com'})}
};
