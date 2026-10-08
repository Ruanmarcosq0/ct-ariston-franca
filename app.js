document.documentElement.classList.add('js');

(() => {
  const groups = [['.hero-content','from-left'],['.benefit',''],['.section-head',''],['.card',''],['.champions-copy','from-left'],['.champions-visual','from-right'],['.float-card',''],['.about-grid > div:first-child','from-left'],['.about-art','from-right'],['.stats-grid > div',''],['.review',''],['.contact-panel','from-right'],['.cta .wrap',''],['footer .foot > div','']];
  const items=[];
  groups.forEach(([sel,extra])=>document.querySelectorAll(sel).forEach((el,i)=>{el.classList.add('reveal');if(extra)el.classList.add(extra);if(i%4)el.classList.add('reveal-delay-'+Math.min(i%4,3));items.push(el);}));
  if(!('IntersectionObserver'in window)){items.forEach(el=>el.classList.add('is-visible'));return;}
  const observer=new IntersectionObserver((entries,obs)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -45px 0px'});
  items.forEach(el=>observer.observe(el));
})();

(() => {
  const menuButton=document.querySelector('.menu');
  const menu=document.querySelector('.links');
  if(!menuButton||!menu)return;
  const closeMenu=()=>{menu.classList.remove('is-open');menuButton.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');};
  menuButton.addEventListener('click',()=>{const open=!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);menuButton.classList.toggle('is-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
  window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu();});
})();

(async()=>{
  const loadAsset = async(files) => {
    const parts = await Promise.all(files.map(f => fetch(f,{cache:'no-store'}).then(r => { if(!r.ok) throw new Error(f); return r.text(); })));
    const b64=parts.join('').replace(/\s/g,'');
    if(!b64 || b64.length%4===1) throw new Error('base64 inválido');
    const src = `data:image/webp;base64,${b64}`;
    await new Promise((resolve,reject)=>{ const i=new Image(); i.onload=resolve; i.onerror=reject; i.src=src; });
    return src;
  };

  const loadFirstValid = async(candidates) => {
    for(const files of candidates){
      try{return await loadAsset(files);}catch(err){console.warn('asset inválido',files,err);}
    }
    return null;
  };

  const assets={};
  const defs={
    hero:[['assets/heroFinal.txt'],['assets/hero-1.txt','assets/hero-2.txt']],
    artes:[['assets/artesFinal.txt'],['assets/muay.txt']],
    force:[['assets/forceFinal.txt'],['assets/muay.txt'],['assets/jiu.txt']],
    bjj:[['assets/jiu.txt'],['assets/hero-1.txt','assets/hero-2.txt']],
    logo:[['assets/logo-1.txt','assets/logo-2.txt']]
  };

  for(const [key,candidates] of Object.entries(defs)) assets[key]=await loadFirstValid(candidates);

  const safeSet=(img,src,alt)=>{
    if(!img)return;
    if(!src){img.removeAttribute('src');img.style.visibility='hidden';return;}
    img.onerror=()=>{img.onerror=null;img.removeAttribute('src');img.style.visibility='hidden';};
    img.src=src; img.alt=alt; img.style.visibility='visible';
  };

  if(assets.logo){
    document.querySelectorAll('[data-asset="logo"]').forEach(el=>safeSet(el,assets.logo,'Logo CT Ariston França'));
    const fav=document.getElementById('site-favicon'); if(fav) fav.href=assets.logo;
  }

  safeSet(document.querySelector('.hero-athlete'),assets.hero,'Representante do CT Ariston França com cinturões e troféus');

  const cards=document.querySelectorAll('#modalidades .card img');
  const cardMap=[
    [assets.bjj,'Atleta de jiu-jitsu do CT Ariston França'],
    [assets.artes,'Atleta do CT Ariston França pronto para luta de Muay Thai'],
    [assets.force,'Lutador do CT Ariston França comemorando vitória']
  ];
  cards.forEach((img,i)=>{
    const item=cardMap[i]; if(!item)return;
    safeSet(img,item[0],item[1]); img.loading='lazy'; img.decoding='async';
    img.style.objectFit='contain'; img.style.objectPosition='center bottom';
  });

  const champ=document.querySelector('#campeoes');
  if(champ){
    safeSet(champ.querySelector('.float-card.muaythai img'),assets.force,'Lutador do CT Ariston França comemorando vitória');
    safeSet(champ.querySelector('.champ-main'),assets.hero,'Representante do CT Ariston França com cinturões e troféus');
    safeSet(champ.querySelector('.float-card.bjj img'),assets.bjj,'Atleta de jiu-jitsu do CT Ariston França');
  }

  const whatsappText='Olá, tudo bem? Vim pelo site do CT Ariston França, gostei muito da apresentação da academia e quero saber mais sobre as modalidades e agendar uma aula experimental.';
  const wa=`https://wa.me/5515996290380?text=${encodeURIComponent(whatsappText)}`;
  document.querySelectorAll('a[href*="wa.me/5515996290380"]').forEach(a=>a.href=wa);

  const style=document.createElement('style');
  style.textContent=`
    .hero-media{overflow:visible!important}.hero-athlete{object-fit:contain!important;object-position:center bottom!important}
    #modalidades .card img{width:100%!important;height:300px!important;object-fit:contain!important;object-position:center bottom!important;padding:14px 12px 0!important;background:radial-gradient(circle at 50% 18%,rgba(229,27,35,.18),transparent 40%),linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.012))!important;filter:contrast(1.1) saturate(1.05)!important}
    #campeoes .champions-visual{overflow:visible!important}#campeoes .champ-main,#campeoes .float-card img{object-fit:contain!important;object-position:center bottom!important}
    @media(max-width:900px){#modalidades .card img{height:260px!important}}
    @media(max-width:560px){#modalidades .card img{height:235px!important;padding:10px 8px 0!important}.hero-athlete{max-width:100%!important;height:auto!important}}
  `;
  document.head.appendChild(style);
})();