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
    hero:['assets/hero-1.txt','assets/hero-2.txt'],
    muaythai:['assets/muay.txt'],
    team:['assets/team-1.txt','assets/team-2.txt','assets/team-3.txt','assets/team-4.txt'],
    jiujitsu:['assets/jiu.txt']
  };
  const uris={};
  for(const [k,files] of Object.entries(defs)){
    try{
      const parts=await Promise.all(files.map(f=>fetch(f,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error(f);return r.text();})));
      const uri=`data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
      uris[k]=uri;
      document.querySelectorAll(`[data-asset="${k}"]`).forEach(el=>el.src=uri);
      if(k==='logo'){
        const fav=document.getElementById('site-favicon');
        if(fav)fav.href=uri;
      }
    }catch(e){console.warn('asset',k,e);}
  }

  // Mantém a hero exatamente como está e usa as fotos reais nos blocos correspondentes.
  const cards=document.querySelectorAll('#modalidades .card img');
  const cardMap=[
    [uris.jiujitsu,'Atleta do CT Ariston França se preparando para treino de jiu-jitsu','center 24%'],
    [uris.team,'Atleta campeão do CT Ariston França com sua equipe','center 28%'],
    [uris.muaythai,'Atleta do CT Ariston França se preparando para luta','38% 24%']
  ];
  cards.forEach((img,i)=>{
    const item=cardMap[i];
    if(!item||!item[0])return;
    img.src=item[0];
    img.alt=item[1];
    img.loading='lazy';
    img.decoding='async';
    img.style.objectFit='cover';
    img.style.objectPosition=item[2];
  });

  const champ=document.querySelector('#campeoes');
  if(champ){
    const trophy=champ.querySelector('.float-card.muaythai img');
    const team=champ.querySelector('.champ-main');
    const bjj=champ.querySelector('.float-card.bjj img');
    if(trophy&&uris.hero){trophy.src=uris.hero;trophy.alt='Atleta campeão do CT Ariston França com troféu';}
    if(team&&uris.team){team.src=uris.team;team.alt='Equipe do CT Ariston França com atleta campeão';}
    if(bjj&&uris.jiujitsu){bjj.src=uris.jiujitsu;bjj.alt='Atleta de jiu-jitsu do CT Ariston França';}
  }

  // Mensagem automática deixa claro que o contato veio pelo site.
  const whatsappText='Olá, tudo bem? Vim pelo site do CT Ariston França, gostei muito da apresentação da academia e quero saber mais sobre as modalidades e agendar uma aula experimental.';
  const wa=`https://wa.me/5515996290380?text=${encodeURIComponent(whatsappText)}`;
  document.querySelectorAll('a[href*="wa.me/5515996290380"]').forEach(a=>a.href=wa);

  // Reforço visual das fotos sem alterar estrutura ou textos.
  const style=document.createElement('style');
  style.textContent=`
    #modalidades .card img{filter:contrast(1.12) saturate(1.06)!important;image-rendering:auto;transition:transform .35s ease,filter .35s ease}
    #modalidades .card:hover img{filter:contrast(1.16) saturate(1.1)!important}
    #campeoes img{filter:contrast(1.1) saturate(1.05) drop-shadow(0 14px 28px rgba(0,0,0,.42));image-rendering:auto}
    .instagram-link,.footer-instagram-cta{transition:transform .25s ease,filter .25s ease}
    .instagram-link:hover,.footer-instagram-cta:hover{transform:translateY(-2px);filter:brightness(1.12)}
  `;
  document.head.appendChild(style);

  // Ícone do Instagram nos CTAs já existentes, preservando a estrutura.
  const igIcon='<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.9 1.15a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.51 5.51 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z"/></svg>';
  const contactIg=document.querySelector('.instagram-link');
  if(contactIg){const icon=contactIg.querySelector('.ig-icon');if(icon)icon.innerHTML=igIcon;}
  const footerIg=document.querySelector('footer a[href*="instagram.com/ctaristonfranca"]');
  if(footerIg){footerIg.classList.add('footer-instagram-cta');if(!footerIg.querySelector('svg'))footerIg.insertAdjacentHTML('afterbegin',igIcon);}
})();
