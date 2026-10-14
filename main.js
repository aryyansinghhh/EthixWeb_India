


/* ── UTILITY ── */
const $  = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);


try{/* ── SCROLL PROGRESS ── */
on(window,'scroll',()=>{
  const pct = window.scrollY/(document.documentElement.scrollHeight-window.innerHeight);
  $('prog').style.width = (Math.min(pct,1)*100)+'%';
},{passive:true});


}catch(e){}

try{/* ── CURSOR (desktop only) ── */
(()=>{
  if(!window.matchMedia('(hover:hover)').matches) return;
  const dot=$('cd'), ring=$('cr');
  let mx=0,my=0,rx=0,ry=0;
  on(document,'mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
  (function raf(){
    rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
    dot.style.left=mx+'px';  dot.style.top=my+'px';
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(raf);
  })();
  document.querySelectorAll('a,button,[role=button],[tabindex="0"]').forEach(el=>{
    on(el,'mouseenter',()=>document.body.classList.add('ch'));
    on(el,'mouseleave',()=>document.body.classList.remove('ch'));
  });
  document.querySelectorAll('.wi').forEach(el=>{
    on(el,'mouseenter',()=>{document.body.classList.remove('ch');document.body.classList.add('cl')});
    on(el,'mouseleave',()=>document.body.classList.remove('cl'));
  });
})();


}catch(e){}

try{/* ── NAV SCROLL ── */
on(window,'scroll',()=>$('nav').classList.toggle('sc',window.scrollY>40),{passive:true});


}catch(e){}

try{/* ── MOBILE NAV ── */
let mobOpen=false;
const burg=$('burg'), mobNav=$('mobNav');
function openMob(){mobOpen=true;mobNav.classList.add('on');document.body.style.overflow='hidden';const sp=burg.querySelectorAll('span');sp[0].style.transform='translateY(6.5px) rotate(45deg)';sp[1].style.opacity='0';sp[2].style.transform='translateY(-6.5px) rotate(-45deg)'}
function closeM(){mobOpen=false;mobNav.classList.remove('on');document.body.style.overflow='';burg.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity=''})}
on(burg,'click',()=>mobOpen?closeM():openMob());
on(burg,'keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();mobOpen?closeM():openMob()}});


}catch(e){}

try{/* ── LIVE CLOCKS ── */
function fmtTZ(tz){try{return new Date().toLocaleTimeString('en-IN',{timeZone:tz,hour:'2-digit',minute:'2-digit',hour12:false})}catch{return'--:--'}}
function tickClocks(){
  const map={istClock:'Asia/Kolkata',clkIN:'Asia/Kolkata',clkSEA:'America/Los_Angeles',clkUT:'America/Denver',clkNY:'America/New_York',clkUK:'Europe/London'};
  for(const[id,tz]of Object.entries(map)){const el=$(id);if(el)el.textContent=fmtTZ(tz)}
}
tickClocks();
setInterval(tickClocks,1000);


}catch(e){}

try{/* ── REVEAL ON SCROLL ── */
const revObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>revObs.observe(el));


}catch(e){}

try{/* ── COUNT-UP ── */
const cuObs=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,target=+el.dataset.t,dur=1400,start=performance.now();
  (function step(now){
    const p=Math.min((now-start)/dur,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(eased*target);
    if(p<1)requestAnimationFrame(step); else el.textContent=target;
  })(start);
  cuObs.unobserve(el);
}),{threshold:.5});
document.querySelectorAll('.cu').forEach(el=>cuObs.observe(el));


}catch(e){}

try{/* ── SERVICES ACCORDION ── */
(()=>{
  const cats=document.querySelectorAll('.svc-cat');
  const ghost=$('svcGhost'),hero=$('svcHero'),bg=$('svcBg'),tag=$('svcTag'),title=$('svcTitle'),desc=$('svcDesc'),bar=$('svcBar');

  function activate(idx){
    cats.forEach((c,i)=>{
      c.classList.toggle('on',i===idx);
      const h=c.querySelector('.svc-head');
      if(h)h.setAttribute('aria-expanded',i===idx?'true':'false');
    });
    const c=cats[idx];
    if(!c)return;
    if(ghost)ghost.textContent=c.dataset.dn||'०१';
    if(bg)bg.textContent=c.dataset.icon||'';
    if(tag)tag.textContent=c.dataset.tag||'';
    if(title)title.textContent=c.dataset.title||'';
    if(desc)desc.textContent=c.dataset.desc||'';
    if(hero)hero.style.background=c.dataset.bg||'#111318';
    if(bar)bar.style.width=((idx+1)/cats.length*100)+'%';
  }

  cats.forEach((c,i)=>{
    const head=c.querySelector('.svc-head');
    // Click only — no mouseenter to avoid double-fire
    on(head,'click',()=>activate(i));
    on(head,'keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(i)}});
    // Mouseenter for desktop panel preview (doesn't open accordion, just updates panel)
    on(head,'mouseenter',()=>{
      if(bg)bg.textContent=c.dataset.icon||'';
      if(tag)tag.textContent=c.dataset.tag||'';
      if(title)title.textContent=c.dataset.title||'';
      if(desc)desc.textContent=c.dataset.desc||'';
      if(hero)hero.style.background=c.dataset.bg||'#111318';
      if(ghost)ghost.textContent=c.dataset.dn||'०१';
      if(bar)bar.style.width=((i+1)/cats.length*100)+'%';
    });
  });
})();


}catch(e){}

try{/* ── PROCESS ── */
(()=>{
  const steps=document.querySelectorAll('.proc-step');
  const labels=['Audit','Plan','Build','Optimize'];
  const descs=['Tearing down your site, ads and tracking — showing exactly where leads leak.','Prioritized roadmap with expected impact. You approve what we build, and why.','Senior hands ship the site, campaigns, and integrations in weeks — not quarters.','Weekly iteration on real data: calls, bookings, and revenue. We optimize forever.'];
  const fills=[25,50,75,100];
  const piIds=['pi0','pi1','pi2','pi3'];

  function act(i){
    steps.forEach((s,j)=>s.classList.toggle('on',j===i));
    const lbl=$('pLbl'),dsc=$('pDsc'),pb=$('pb1');
    if(lbl)lbl.textContent=labels[i];
    if(dsc)dsc.textContent=descs[i];
    if(pb)pb.style.width=fills[i]+'%';
    piIds.forEach((id,j)=>{const el=$(id);if(el)el.classList.toggle('on',j<=i)});
  }

  steps.forEach((s,i)=>{
    on(s,'click',()=>act(i));
    on(s,'mouseenter',()=>act(i));
  });

  let cur=0;
  setInterval(()=>{cur=(cur+1)%steps.length;act(cur)},4000);
})();


}catch(e){}

try{/* ── WORK FILTER ── */
(()=>{
  const filters=document.querySelectorAll('.wf');
  const items=document.querySelectorAll('.wi');
  filters.forEach(btn=>on(btn,'click',()=>{
    filters.forEach(b=>{b.classList.remove('on');b.setAttribute('aria-selected','false')});
    btn.classList.add('on');btn.setAttribute('aria-selected','true');
    const f=btn.dataset.f;
    items.forEach(it=>{
      const show=f==='all'||it.dataset.cat===f;
      it.style.opacity=show?'1':'0.18';
      it.style.pointerEvents=show?'':'none';
      it.style.transition='opacity .4s cubic-bezier(.16,1,.3,1)';
    });
  }));
})();


}catch(e){}

try{/* ── LIGHTBOX ── */
let lbIdx=0;
function openLB(i){
  lbIdx=i;
  const d=LB[i];
  $('lbcat').textContent=d.cat;
  $('lbtitle').textContent=d.title;
  $('lbdesc').textContent=d.desc;
  $('lbtags').innerHTML=d.tags.map(t=>`<span class="lbtag">${esc(t)}</span>`).join('');
  $('lbox').classList.add('on');
  $('lbox').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  document.body.classList.add('cl');
  $('lbc').focus();
}
function closeLB(){
  $('lbox').classList.remove('on');
  $('lbox').setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  document.body.classList.remove('cl');
}
on($('lbc'),'click',closeLB);
on($('lbprev'),'click',()=>openLB((lbIdx-1+LB.length)%LB.length));
on($('lbnext'),'click',()=>openLB((lbIdx+1)%LB.length));
on($('lbox'),'click',e=>{if(e.target===$('lbox'))closeLB()});
on(document,'keydown',e=>{
  if($('lbox').classList.contains('on')){
    if(e.key==='Escape'){closeLB()}
    if(e.key==='ArrowLeft'){$('lbprev').click()}
    if(e.key==='ArrowRight'){$('lbnext').click()}
  }
});
document.querySelectorAll('.wi').forEach((el,i)=>{
  on(el,'click',()=>openLB(i));
  on(el,'keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLB(i)}});
});
// Touch swipe
(()=>{
  let sx=0;
  const g=$('wGrid');if(!g)return;
  on(g,'touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  on(g,'touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>50&&$('lbox').classList.contains('on')){dx<0?$('lbnext').click():$('lbprev').click()}
  },{passive:true});
})();


}catch(e){}

try{/* ── REVIEW RAIL drag scroll ── */
(()=>{
  const rail=$('revRail');if(!rail)return;
  let isDown=false,startX=0,scrollLeft=0;
  on(rail,'mousedown',e=>{isDown=true;rail.style.cursor='grabbing';startX=e.pageX-rail.offsetLeft;scrollLeft=rail.scrollLeft});
  on(rail,'mouseleave',()=>{isDown=false;rail.style.cursor='grab'});
  on(rail,'mouseup',()=>{isDown=false;rail.style.cursor='grab'});
  on(rail,'mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-rail.offsetLeft;rail.scrollLeft=scrollLeft-(x-startX)*1.2});
})();


}catch(e){}

try{/* ── INDIA LANGUAGE GREETING CYCLE ── */
(()=>{
  // Correct greetings in 6 major Indian languages
  const greetings=[
    'नमस्ते — Built for India',      // Hindi
    'ਸਤ ਸ੍ਰੀ ਅਕਾਲ — Built for India', // Punjabi
    'நமஸ்காரம் — Built for India',   // Tamil
    'నమస్కారం — Built for India',    // Telugu
    'ನಮಸ್ಕಾರ — Built for India',     // Kannada
    'নমস্কার — Built for India',      // Bengali (correct word)
  ];
  let gi=0;
  const el=$('namasteGreet');if(!el)return;
  el.style.transition='opacity .35s ease';
  setInterval(()=>{
    el.style.opacity='0';
    setTimeout(()=>{gi=(gi+1)%greetings.length;el.textContent=greetings[gi];el.style.opacity='1'},350);
  },2800);
})();


}catch(e){}
