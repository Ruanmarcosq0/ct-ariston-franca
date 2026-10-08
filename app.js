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
  const defs={
    logo:['assets/logo-1.txt','assets/logo-2.txt'],
    hero:['assets/heroFinal.txt'],
    bjj:['assets/jiuFinal.txt'],
    artes:['assets/artesFinal.txt'],
    force:['assets/forceFinal.txt']
  };

  const preload=(src)=>new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(src);
    img.onerror=()=>reject(new Error('imagem inválida'));
    img.src=src;
  });

  const uris={};
  for(const [key,files] of Object.entries(defs)){
    try{
      const parts=await Promise.all(files.map(file=>fetch(file,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error(file);return r.text();})));
      const uri=`data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
      await preload(uri);
      uris[key]=uri;
      if(key==='logo'){
        document.querySelectorAll('[data-asset="logo"]').forEach(el=>el.src=uri);
        const fav=document.getElementById('site-favicon');
        if(fav) fav.href=uri;
      }
    }catch(e){console.warn('asset',key,e);}
  }

  const safeImage=(img,src,alt)=>{
    if(!img)return;
    img.onerror=()=>{img.onerror=null;img.removeAttribute('src');img.style.visibility='hidden';};
    if(src){img.style.visibility='visible';img.src=src;}else{img.style.visibility='hidden';}
    if(alt)img.alt=alt;
    img.decoding='async';
  };

  const hero=document.querySelector('.hero-athlete');
  safeImage(hero,uris.hero,'Representante do CT Ariston França com cinturões e troféus');
  if(hero){hero.loading='eager';hero.fetchPriority='high';}

  const cards=document.querySelectorAll('#modalidades .card img');
  const cardMap=[
    [uris.bjj,'Atleta campeão do CT Ariston França com cinturão'],
    [uris.artes,'Atleta do CT Ariston França em posição de luta de Muay Thai'],
    [uris.force,'Lutador do CT Ariston França comemorando vitória']
  ];
  cards.forEach((img,i)=>{
    const item=cardMap[i];
    if(item)safeImage(img,item[0],item[1]);
    img.loading='lazy';
  });

  const champ=document.querySelector('#campeoes');
  if(champ){
    safeImage(champ.querySelector('.float-card.muaythai img'),uris.force,'Lutador do CT Ariston França comemorando vitória');
    safeImage(champ.querySelector('.champ-main'),uris.hero,'Representante do CT Ariston França com cinturões e troféus');
    safeImage(champ.querySelector('.float-card.bjj img'),uris.bjj,'Atleta campeão do CT Ariston França com cinturão');
  }

  const whatsappText='Olá, tudo bem? Vim pelo site do CT Ariston França, gostei muito da apresentação da academia e quero saber mais sobre as modalidades e agendar uma aula experimental.';
  const wa=`https://wa.me/5515996290380?text=${encodeURIComponent(whatsappText)}`;
  document.querySelectorAll('a[href*="wa.me/5515996290380"]').forEach(a=>a.href=wa);

  const style=document.createElement('style');
  style.textContent=`
    .hero-media{min-height:600px!important;display:flex!important;align-items:flex-end!important;justify-content:center!important;overflow:visible!important}
    .hero-athlete{display:block!important;width:min(100%,560px)!important;max-width:560px!important;height:auto!important;max-height:690px!important;object-fit:contain!important;object-position:center bottom!important;filter:drop-shadow(0 18px 40px rgba(0,0,0,.58)) drop-shadow(0 0 24px rgba(229,27,35,.16))!important}
    #modalidades .card{overflow:hidden!important}
    #modalidades .card img{display:block!important;width:100%!important;height:300px!important;object-fit:contain!important;object-position:center bottom!important;padding:14px 12px 0!important;background:radial-gradient(circle at 50% 22%,rgba(229,27,35,.16),transparent 42%),linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,.01))!important;filter:contrast(1.08) saturate(1.04)!important;box-sizing:border-box!important;transition:transform .35s ease,filter .35s ease!important}
    #modalidades .card:hover img{transform:translateY(-4px) scale(1.015)!important;filter:contrast(1.12) saturate(1.08)!important}
    #campeoes .champions-visual{min-height:600px!important;overflow:visible!important}
    #campeoes .champ-main{display:block!important;width:min(100%,470px)!important;max-width:470px!important;height:auto!important;max-height:580px!important;object-fit:contain!important;object-position:center bottom!important}
    #campeoes .float-card{overflow:hidden!important}
    #campeoes .float-card img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center bottom!important;padding:7px 5px 0!important;box-sizing:border-box!important}
    .instagram-link,.footer-instagram-cta{transition:transform .25s ease,filter .25s ease}
    .instagram-link:hover,.footer-instagram-cta:hover{transform:translateY(-2px);filter:brightness(1.12)}
    @media(max-width:900px){
      .hero-media{min-height:510px!important}.hero-athlete{width:min(100%,485px)!important;max-height:590px!important}
      #modalidades .card img{height:260px!important}
      #campeoes .champions-visual{min-height:500px!important}#campeoes .champ-main{width:min(100%,410px)!important;max-height:500px!important}
    }
    @media(max-width:560px){
      .hero-media{min-height:410px!important;margin-top:20px!important}.hero-athlete{width:min(100%,370px)!important;max-height:450px!important}
      #modalidades .card img{height:245px!important;padding:10px 8px 0!important}
      #campeoes .champions-visual{min-height:430px!important}#campeoes .champ-main{width:min(100%,325px)!important;max-height:410px!important}
      #campeoes .float-card.muaythai{width:142px!important;height:190px!important;left:0!important;bottom:4px!important}
      #campeoes .float-card.bjj{width:138px!important;height:195px!important;right:0!important;top:5px!important}
    }
  `;
  document.head.appendChild(style);

  const igIcon='<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.9 1.15a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.51 5.51 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z"/></svg>';
  const contactIg=document.querySelector('.instagram-link');
  if(contactIg){const icon=contactIg.querySelector('.ig-icon');if(icon)icon.innerHTML=igIcon;}
  const footerIg=document.querySelector('footer a[href*="instagram.com/ctaristonfranca"]');
  if(footerIg){footerIg.classList.add('footer-instagram-cta');if(!footerIg.querySelector('svg'))footerIg.insertAdjacentHTML('afterbegin',igIcon);}
})();
