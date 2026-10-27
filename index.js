/* Kinetic portfolio. Dependency-free, progressively enhanced. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let paused = preference.matches;
  const nav = $('#nav'), menu = $('#mobileMenu'), hamburger = $('#hamburger');
  const main = $('main'), footer = $('footer');
  function setMenu(open) {
    menu.classList.toggle('open', open); menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    hamburger.classList.toggle('open', open); hamburger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('menu-open', open);
    main.inert = open; footer.inert = open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a').focus();
  }
  menu.inert = true;
  hamburger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('.m-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width: 769px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  const progress = $('.reading-progress');
  let scrollPending = false;
  const darkSections = $$('.section--ink, .footer, .marquee-band');
  function updateScroll() {
    const y = scrollY, total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? y / total : 0})`;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('nav--light', darkSections.some(el => {const r = el.getBoundingClientRect(); return r.top < 40 && r.bottom > 40;}));
    scrollPending = false;
  }
  addEventListener('scroll', () => {if (!scrollPending) {scrollPending = true; requestAnimationFrame(updateScroll);}}, {passive:true});
  addEventListener('resize', updateScroll); updateScroll();
  if ('IntersectionObserver' in window) {
    if (!preference.matches) document.documentElement.classList.add('js-motion');
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}), {threshold:0.05});
    $$('.reveal, .reveal-img').forEach(el => reveal.observe(el));
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting) $$('.nav-link').forEach(a => {const active = a.hash === `#${e.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    }),{rootMargin:'-15% 0px -65% 0px'});
    $$('section[id]').forEach(el => sectionObserver.observe(el));
    const bars = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting)e.target.classList.add('in-view');}));
    $$('.vp-card').forEach(el=>bars.observe(el));
  }
  $$('.work-filters button').forEach(button => button.addEventListener('click', () => {
    $$('.work-filters button').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
    let count = 0;
    $$('.index-card').forEach(card => {card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;if(!card.hidden){card.classList.add('visible');count++;}});
    $('#filterStatus').textContent = `${count} projects shown`;updateScroll();
  }));
  $$('.tilt-surface').forEach(el => {
    el.addEventListener('pointermove', e => {if(paused||!finePointer.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--rx',`${(0.5-(e.clientY-r.top)/r.height)*7}deg`);el.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-0.5)*9}deg`);});
    el.addEventListener('pointerleave', () => {el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});
  });
  // Creative gallery: keyboard access, modal focus restoration and trapping.
  const lightbox = $('#lightbox'), close = $('#lightboxClose'); let previousFocus;
  lightbox.inert = true;
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightbox.inert=true;main.inert=false;nav.inert=false;footer.inert=false;document.body.style.overflow='';previousFocus?.focus();}
  $$('.cr-item').forEach(item => {
    item.tabIndex=0;item.setAttribute('role', 'button'); item.setAttribute('aria-label',item.dataset.caption || item.querySelector('.cr-item-title')?.textContent || 'View creative work');
    function activate(){if(item.dataset.videoUrl){window.open(item.dataset.videoUrl,'_blank','noopener,noreferrer');return;}if(!item.dataset.lightbox)return;previousFocus=item;$('#lightboxImg').src=item.dataset.lightbox;$('#lightboxImg').alt=item.dataset.caption||'';$('#lightboxCaption').textContent=item.dataset.caption||'';lightbox.inert=false;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');main.inert=true;nav.inert=true;footer.inert=true;document.body.style.overflow='hidden';close.focus();}
    item.addEventListener('click',activate);item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });
  close.addEventListener('click',closeLightbox);$('#lightboxBackdrop').addEventListener('click',closeLightbox);
  document.addEventListener('keydown',e=>{
    const modalOpen=lightbox.classList.contains('open'),menuOpen=menu.classList.contains('open');
    if(e.key==='Escape'){if(modalOpen)closeLightbox();else if(menuOpen){setMenu(false);hamburger.focus();}}
    if(e.key==='Tab' && (modalOpen||menuOpen)){
      const items=modalOpen?[close]:[hamburger,...menu.querySelectorAll('a')];const first=items[0],last=items.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  // A toroidal field projected from 3D. No network, WebGL dependency, or tracking.
  const canvas=$('#sculpture'),ctx=canvas.getContext('2d'),wrap=canvas.parentElement;
  if(!ctx)return;
  let width=0,height=0,visible=true,frame=0,time=0,lastTime=0,rotationX=0,rotationY=0,targetX=0,targetY=0,burst=0;
  const points=[];
  for(let ring=0;ring<94;ring++)for(let step=0;step<32;step++) points.push({u:ring/94*Math.PI*2,v:step/32*Math.PI*2});
  function resize(){const r=wrap.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render();}
  function render(){
    ctx.clearRect(0,0,width,height);
    const scale=Math.min(width/3.1,height/2.8),a=time*.16+rotationY+.35,b=.65+rotationX;
    const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),projected=[];
    for(const p of points){
      const wave=.055*Math.sin(p.u*3+p.v*2+time*.7),tube=.39+wave+burst*.13;
      let x=(.86+tube*Math.cos(p.v))*Math.cos(p.u),y=(.86+tube*Math.cos(p.v))*Math.sin(p.u),z=tube*Math.sin(p.v);
      const y1=y*cb-z*sb,z1=y*sb+z*cb,x1=x*ca+z1*sa,z2=-x*sa+z1*ca;
      const perspective=3.8/(3.8+z2);projected.push({x:width*.53+x1*scale*perspective,y:height*.48+y1*scale*perspective,z:z2,p:perspective});
    }
    projected.sort((p,q)=>q.z-p.z);
    for(const p of projected){const alpha=Math.max(.09,Math.min(.9,(1.5-p.z)/3));ctx.fillStyle=`rgba(230,230,225,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.4,(1.1-p.z*.36)*p.p),0,Math.PI*2);ctx.fill();}
    // Orbital drafting ellipse anchors the sculpture in space.
    ctx.strokeStyle='rgba(200,200,200,.13)';ctx.lineWidth=.65;ctx.beginPath();ctx.ellipse(width*.53,height*.48,scale*1.5,scale*.52,-.35,0,Math.PI*2);ctx.stroke();
  }
  function tick(now){frame=0;if(paused||!visible||document.hidden){lastTime=0;return;}if(lastTime && now-lastTime<32){frame=requestAnimationFrame(tick);return;}time+=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;rotationX+=(targetX-rotationX)*.045;rotationY+=(targetY-rotationY)*.045;burst*=.94;render();frame=requestAnimationFrame(tick);}
  function start(){if(!frame&&!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
  wrap.addEventListener('pointermove',e=>{if(paused||!finePointer.matches)return;const r=wrap.getBoundingClientRect();targetX=((e.clientY-r.top)/height-.5)*.65;targetY=((e.clientX-r.left)/width-.5)*.7;});
  wrap.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});
  canvas.addEventListener('pointerdown',()=>{if(!paused)burst=1;});
  const toggle=$('#motionToggle');
  function setPaused(value){paused=value;document.body.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';if(paused)stop();else start();}
  toggle.addEventListener('click',()=>setPaused(!paused));preference.addEventListener('change',e=>setPaused(e.matches));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();}).observe(wrap);
  new ResizeObserver(resize).observe(wrap);setPaused(paused);resize();start();
})();
