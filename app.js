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
    const src = `data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
    await new Promise((resolve,reject)=>{ const i=new Image(); i.onload=resolve; i.onerror=reject; i.src=src; });
    return src;
  };

  const assets={};
  const defs={
    hero:['assets/heroFinal.txt'],
    artes:['assets/artesFinal.txt'],
    force:['assets/forceFinal.txt'],
    bjj:['assets/jiu.txt'],
    logo:['assets/logo-1.txt','assets/logo-2.txt']
  };

  for(const [key,files] of Object.entries(defs)){
    try{ assets[key]=await loadAsset(files); }
    catch(err){ console.warn('Falha ao carregar asset',key,err); }
  }

  if(assets.logo){
    document.querySelectorAll('[data-asset="logo"]').forEach(el=>el.src=assets.logo);
    const fav=document.getElementById('site-favicon'); if(fav) fav.href=assets.logo;
  }

  const hero=document.querySelector('.hero-athlete');
  if(hero && assets.hero){ hero.src=assets.hero; hero.alt='Representante do CT Ariston França com cinturões e troféus'; }

  const cards=document.querySelectorAll('#modalidades .card img');
  const cardMap=[
    [assets.bjj,'Atleta de jiu-jitsu do CT Ariston França'],
    [assets.artes,'Atleta do CT Ariston França pronto para luta de Muay Thai'],
    [assets.force,'Lutador do CT Ariston França comemorando vitória']
  ];
  cards.forEach((img,i)=>{
    const item=cardMap[i]; if(!item||!item[0]) return;
    img.src=item[0]; img.alt=item[1]; img.loading='lazy'; img.decoding='async';
    img.style.objectFit='contain'; img.style.objectPosition='center bottom';
  });

  const champ=document.querySelector('#campeoes');
  if(champ){
    const left=champ.querySelector('.float-card.muaythai img');
    const main=champ.querySelector('.champ-main');
    const right=champ.querySelector('.float-card.bjj img');
    if(left && assets.force){ left.src=assets.force; left.alt='Lutador do CT Ariston França comemorando vitória'; }
    if(main && assets.hero){ main.src=assets.hero; main.alt='Representante do CT Ariston França com cinturões e troféus'; }
    if(right && assets.bjj){ right.src=assets.bjj; right.alt='Atleta de jiu-jitsu do CT Ariston França'; }
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
