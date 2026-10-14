const {STATUSES,json,sb,isAdmin,sameOrigin}=require('../_lib');
const UUID=/^[0-9a-f-]{36}$/i;
module.exports=async(req,res)=>{
  if(!isAdmin(req))return json(res,401,{error:'Unauthorized'});
  try{
    if(req.method==='GET')return json(res,200,{leads:await sb('leads?select=id,created_at,name,email,phone,service,message,status&order=created_at.desc&limit=1000')});
    if(!sameOrigin(req))return json(res,403,{error:'Forbidden'});
    if(req.method==='PATCH'){
      const {id,status}=req.body||{};
      if(!UUID.test(id||'')||!STATUSES.includes(status))return json(res,422,{error:'Invalid input'});
      await sb('leads?id=eq.'+id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status})});return json(res,200,{ok:true});
    }
    if(req.method==='DELETE'){
      const id=req.query.id;if(!UUID.test(id||''))return json(res,422,{error:'Invalid id'});
      await sb('leads?id=eq.'+id,{method:'DELETE',headers:{Prefer:'return=minimal'}});return json(res,200,{ok:true});
    }
    res.setHeader('Allow','GET, PATCH, DELETE');return json(res,405,{error:'Method not allowed'});
  }catch(e){console.error(e.message);return json(res,500,{error:'Server error'})}
};
