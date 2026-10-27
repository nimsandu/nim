/* Mission portfolio: shared behaviour for the home, archive and case studies. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  // Optional user-supplied assets are configured in one small file.
  const assets = window.MISSION_ASSETS || {};
  if (assets.illuminatingReport) {
    const download = $('[data-report-download]');
    if (download) { download.href = assets.illuminatingReport; download.hidden = false; }
    $$('[data-report-pending]').forEach(el => { el.hidden = true; });
  }
  if (assets.illuminatingTeamImage) {
    const placeholder = $('[data-team-placeholder]');
    if (placeholder) { const image = document.createElement('img'); image.src = assets.illuminatingTeamImage; image.alt = 'Illuminating the Margins project team'; image.loading = 'lazy'; placeholder.replaceChildren(image); }
  }
  if (assets.semAppImage) {
    $$('.semapp-display img').forEach(image => { image.src = assets.semAppImage; image.alt = 'FoE-SemApp application screenshot'; });
    $$('.placeholder-note').forEach(el => { el.hidden = true; });
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  let paused = reduced.matches;
  try { paused = paused || sessionStorage.getItem('mission-paused') === 'true'; } catch {}
  const nav = $('.site-nav');
  const menu = $('#mobile-menu');
  const menuButton = $('.menu-toggle');
  const main = $('main');
  const footer = $('.site-footer');
  const toggleMotion = $('#motionToggle');
  const progress = $('.reading-progress');
  const chapter = $('#chapterStatus');
  function setMenu(open, restore = false) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    main.inert = open;
    footer.inert = open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a')?.focus();
    else if (restore) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width:761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (menu.hidden) return;
    if (e.key === 'Escape') setMenu(false, true);
    if (e.key === 'Tab') {
      const first = menuButton, last = menu.querySelector('a:last-child');
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let scrollQueued = false;
  function updateScroll() {
    const available = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${available ? scrollY / available : 0})`;
    nav.classList.toggle('scrolled', scrollY > 25);
    scrollQueued = false;
  }
  addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  addEventListener('resize', updateScroll);
  updateScroll();
  // Readable first; motion is a progressive enhancement.
  if ('IntersectionObserver' in window) {
    if (!reduced.matches) document.documentElement.classList.add('js-motion');
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); }
    }), { threshold: .04 });
    $$('.reveal').forEach(el => reveal.observe(el));
    const chapters = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting && chapter) chapter.textContent = e.target.dataset.chapter;
    }), { rootMargin: '-5% 0px -60% 0px' });
    $$('[data-chapter]').forEach(el => chapters.observe(el));
  }
  function localTime() {
    const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
    $$('[data-local-time]').forEach(el => { el.textContent = `COLOMBO / ${time} SLT`; });
  }
  localTime(); setInterval(localTime, 60000);
  $$('.spotlight').forEach(el => el.addEventListener('pointermove', e => {
    if (!fine.matches || paused) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));
  $$('.tilt-surface').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (!fine.matches || paused) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--rx', `${(.5 - (e.clientY - r.top) / r.height) * 5}deg`);
      el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 7}deg`);
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
  // Hands-on engineering previews, also operable by keyboard.
  $$('[data-solar-toggle]').forEach(button => button.addEventListener('click', () => {
    const stage = button.closest('.solar-visual');
    const night = stage.dataset.light !== 'night';
    stage.dataset.light = night ? 'night' : 'day';
    button.setAttribute('aria-pressed', String(night));
    button.textContent = night ? 'Night mode / switch to day ↔' : 'Day mode / switch to night ↔';
  }));
  function drawMiniChair(stage, degrees) {
    const pivot = { x:142, y:169 }, attach = { x:241, y:175 }, base = { x:241, y:255 };
    const angle = degrees * Math.PI / 180, dx = attach.x-pivot.x, dy = attach.y-pivot.y;
    const end = { x:pivot.x+dx*Math.cos(angle)-dy*Math.sin(angle), y:pivot.y+dx*Math.sin(angle)+dy*Math.cos(angle) };
    stage.querySelector('.mini-seat').setAttribute('transform', `rotate(${degrees} ${pivot.x} ${pivot.y})`);
    const vx=end.x-base.x, vy=end.y-base.y, length=Math.hypot(vx,vy), ux=vx/length, uy=vy/length;
    const lead=10, width=8, coils=8, span=length-lead*2;
    let path=`M${base.x} ${base.y} L${base.x+ux*lead} ${base.y+uy*lead}`;
    for(let i=1;i<=coils*2;i++) {
      const distance=lead+span*i/(coils*2+1), side=(i%2?1:-1)*width;
      path+=` L${base.x+ux*distance-uy*side} ${base.y+uy*distance+ux*side}`;
    }
    path+=` L${end.x-ux*lead} ${end.y-uy*lead} L${end.x} ${end.y}`;
    stage.querySelector('.mini-spring').setAttribute('d',path);
  }
  $$('[data-chair-toggle]').forEach(button => {
    const stage=button.closest('.chair-visual'), state={angle:0,frame:0};
    drawMiniChair(stage,0);
    button.addEventListener('click', () => {
      const released=stage.dataset.released!=='true', target=released?-16:0;
      stage.dataset.released=String(released);button.setAttribute('aria-pressed',String(released));
      button.textContent=released?'Compress the spring ↓':'Release the spring ↑';
      cancelAnimationFrame(state.frame);
      if(paused||reduced.matches) {state.angle=target;drawMiniChair(stage,target);return;}
      const from=state.angle,start=performance.now();
      function step(now) {
        const fraction=Math.min(1,(now-start)/850),ease=1-Math.pow(1-fraction,3);
        state.angle=from+(target-from)*ease;drawMiniChair(stage,state.angle);
        if(fraction<1)state.frame=requestAnimationFrame(step);else state.frame=0;
      }
      state.frame=requestAnimationFrame(step);
    });
  });
  const disciplines = {
    engineering: { label: 'MATTER / MOTION / CONSTRAINTS', title: 'Understand it.\nThen build it.', copy: 'Mechanical engineering brings the ideas into the physical world: CAD, materials, mechanisms, and prototypes that have to work beyond the screen.', href: '#engineering', link: 'Explore engineering ↗' },
    development: { label: 'LOGIC / SYSTEMS / POSSIBILITY', title: 'Make the complex\nfeel simple.', copy: 'From native Android capabilities and real-time sync to small browser tools. I build systems around the way people actually use them.', href: '/work.html', link: 'Explore software ↗' },
    design: { label: 'IDENTITY / PRINT / MOTION', title: 'Give an idea\na life of its own.', copy: 'Brand identities, publications, digital graphics, and motion. Design is where a system becomes something people recognise and connect with.', href: '#creative', link: 'Explore creative work ↗' }
  };
  $$('[data-discipline]').forEach(button => button.addEventListener('click', () => {
    const d = disciplines[button.dataset.discipline];
    $$('[data-discipline]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('#disciplineLabel').textContent = d.label;
    $('#disciplineTitle').textContent = d.title;
    $('#disciplineCopy').textContent = d.copy;
    $('#disciplineLink').href = d.href;
    $('#disciplineLink').textContent = d.link;
  }));
  $$('.work-filters button').forEach(button => button.addEventListener('click', () => {
    $$('.work-filters button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    $$('.index-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) { card.classList.add('visible'); count++; }
    });
    $('#filterStatus').textContent = `${count} projects shown`;
    updateScroll();
  }));
  const gallery = $('#galleryDialog');
  $$('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    gallery.querySelector('img').src = button.dataset.lightbox;
    gallery.querySelector('img').alt = button.dataset.caption;
    gallery.querySelector('p').textContent = button.dataset.caption;
    gallery.showModal();
    document.body.style.overflow = 'hidden';
  }));
  gallery.querySelector('.dialog-close').addEventListener('click', () => gallery.close());
  gallery.addEventListener('click', e => { if (e.target === gallery) { const r = gallery.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) gallery.close(); } });
  gallery.addEventListener('close', () => { document.body.style.overflow = ''; });
  $('[data-copy-email]')?.addEventListener('click', async e => {
    const button = e.currentTarget;
    try { await navigator.clipboard.writeText('hello@nimaat.top'); button.textContent = 'Copied ✓'; $('[data-copy-status]').textContent = 'Email address copied'; }
    catch { button.textContent = 'hello@nimaat.top'; $('[data-copy-status]').textContent = 'Select and copy hello@nimaat.top'; }
  });
  $('#expandOverview')?.addEventListener('click', e => {
    const expanded = $('#overviewFrame').classList.toggle('expanded');
    e.currentTarget.setAttribute('aria-pressed', String(expanded));
    e.currentTarget.textContent = expanded ? 'Collapse view ⤡' : 'Expand view ⤢';
  });
  // Shared animation scheduler. Paused and background documents consume no frames.
  const stars = $('#starfield'), starContext = stars?.getContext('2d');
  const sculpture = $('#sculpture'), context = sculpture?.getContext('2d');
  let sw = innerWidth, sh = innerHeight, width = 0, height = 0;
  let raf = 0, last = 0, elapsed = 0, sculptureVisible = true;
  const pointer = { x: -1000, y: -1000 };
  let seed = 42;
  function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  const starPoints = Array.from({ length: 140 }, () => ({ x: random(), y: random(), z: .2 + random() * .8, phase: random() * 6.28 }));
  const forms = [], gridU = 124, gridV = 40;
  for (let u = 0; u < gridU; u++) for (let v = 0; v < gridV; v++) {
    const a = u / gridU * Math.PI * 2, b = v / gridV * Math.PI * 2;
    const index = u * gridV + v, face = index % 6;
    const q = u / (gridU - 1) * 2 - 1, t = v / (gridV - 1) * 2 - 1;
    const cube = [[1,q,t],[-1,q,t],[q,1,t],[q,-1,t],[q,t,1],[q,t,-1]][face];
    const teeth = .13 * Math.tanh(Math.cos(a * 12) * 5);
    const gearRadius = .88 + teeth + .25 * Math.cos(b);
    const ribbonRadius = .8 + .3 * Math.cos(a * 3) + .14 * Math.cos(b);
    forms.push({
      u: a, v: b,
      engineering: [gearRadius * Math.cos(a), gearRadius * Math.sin(a), .22 * Math.sin(b)],
      development: cube.map(value => value * .82),
      design: [ribbonRadius * Math.cos(a), ribbonRadius * Math.sin(a), .5 * Math.sin(a * 3) + .14 * Math.sin(b)]
    });
  }
  let from = 'engineering', current = 'engineering', blend = 1;
  let positions = forms.map(p => [...p.engineering]), origins = positions;
  let rx = .65, ry = .2, targetRx = .65, targetRy = .2, burst = 0, dragging = false, moved = false, dragX = 0, dragY = 0;
  const turn = (x, y, z, a, b) => {
    const yy = y * Math.cos(a) - z * Math.sin(a), zz = y * Math.sin(a) + z * Math.cos(a);
    return [x * Math.cos(b) + zz * Math.sin(b), yy, -x * Math.sin(b) + zz * Math.cos(b)];
  };
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    sw = innerWidth; sh = innerHeight;
    if (stars && starContext) { stars.width = sw * dpr; stars.height = sh * dpr; starContext.setTransform(dpr, 0, 0, dpr, 0, 0); }
    if (sculpture && context) { const r = sculpture.getBoundingClientRect(); width = r.width; height = r.height; sculpture.width = width * dpr; sculpture.height = height * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); }
    draw();
  }
  const isLight = () => document.documentElement.dataset.theme === 'light';
  const canvasInk = () => isLight() ? '35,39,43' : '230,232,232';
  function drawStars() {
    if (!starContext) return;
    starContext.clearRect(0, 0, sw, sh);
    const count = sw < 700 ? 65 : starPoints.length;
    for (let i = 0; i < count; i++) {
      const p = starPoints[i];
      const x = (p.x * sw + Math.sin(elapsed * .02 + p.phase) * 7 * p.z + sw) % sw;
      const y = (p.y * sh - scrollY * .015 * p.z + sh * 100) % sh;
      const alpha = .15 + p.z * .3 + Math.sin(elapsed * .4 + p.phase) * .07;
      starContext.fillStyle = `rgba(${canvasInk()},${alpha})`;
      starContext.fillRect(x, y, p.z > .8 ? 1.2 : .65, p.z > .8 ? 1.2 : .65);
      const distance = Math.hypot(pointer.x - x, pointer.y - y);
      if (distance < 120 && !paused && fine.matches) { starContext.strokeStyle = `rgba(${canvasInk()},${(1 - distance / 120) * .12})`; starContext.beginPath(); starContext.moveTo(x, y); starContext.lineTo(pointer.x, pointer.y); starContext.stroke(); }
    }
  }
  function drawSculpture() {
    if (!context || !width || !sculptureVisible) return;
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width / 4.1, height / 3.9), ax = rx, ay = ry + elapsed * .13;
    const e = 1 - Math.pow(1 - blend, 3), rendered = [];
    const stride = width < 450 ? 2 : 1;
    for (let i = 0; i < forms.length; i += stride) {
      const point = forms[i], dest = point[current], origin = origins[i];
      const p = origin.map((value, index) => value + (dest[index] - value) * e);
      positions[i] = p;
      const wave = (Math.sin(point.u * 4 + elapsed * .65) + Math.cos(point.v * 3 + elapsed * .5)) * .018 + burst * Math.sin(point.u * 7 + elapsed * 3) * .1;
      const [x, y, z] = turn(p[0] * (1 + wave), p[1] * (1 + wave), p[2] * (1 + wave), ax, ay);
      const perspective = 4.4 / (4.4 + z);
      rendered.push({ x: width * .52 + x * scale * perspective, y: height * .45 + y * scale * perspective, z, size: perspective * (.72 + .3 * Math.cos(point.v)), lum: .2 + .8 * Math.max(0, Math.sin(point.v + point.u) * .5 + .5) });
    }
    rendered.sort((a, b) => b.z - a.z);
    for (const p of rendered) {
      const alpha = Math.max(.06, Math.min(.95, (.54 + (1.3 - p.z) * .27) * p.lum));
      context.fillStyle = `rgba(${canvasInk()},${alpha})`;
      context.beginPath(); context.arc(p.x, p.y, Math.max(.45, p.size * 1.2), 0, Math.PI * 2); context.fill();
    }
    const anchors = [[.18,.32,.66,.12,0], [.78,.62,-.4,-.55,.25]];
    for (const [nx,ny,px,py,pz] of anchors) {
      const [x,y,z] = turn(px,py,pz,ax,ay), perspective = 4.4 / (4.4 + z);
      const sx = width*.52+x*scale*perspective, sy = height*.45+y*scale*perspective;
      context.strokeStyle = `rgba(${canvasInk()},.22)`; context.lineWidth = .7;
      context.beginPath(); context.moveTo(sx,sy); context.lineTo(width*nx,height*ny); context.stroke();
      context.fillStyle = `rgba(${canvasInk()},.65)`;context.fillRect(sx-1.5,sy-1.5,3,3);
    }
    // Three fine orbital paths and tracked satellites give the form a frame of reference.
    for (let ring = 0; ring < 2; ring++) {
      context.strokeStyle = `rgba(${canvasInk()},${ring ? .06 : .12})`; context.lineWidth = .7; context.beginPath();
      for (let s = 0; s <= 150; s++) {
        const theta = s / 150 * Math.PI * 2, r = 1.55 + ring * .12;
        const [x, y, z] = turn(Math.cos(theta) * r, Math.sin(theta) * r, 0, .9 + ring * .65, -.2 + ring * .8 + elapsed * .02);
        const perspective = 4.4 / (4.4 + z), px = width * .52 + x * scale * perspective, py = height * .45 + y * scale * perspective;
        if (!s) context.moveTo(px, py); else context.lineTo(px, py);
      }
      context.stroke();
      const theta = elapsed * .2 + ring * 2.1, r = 1.55 + ring * .12;
      const [x, y, z] = turn(Math.cos(theta) * r, Math.sin(theta) * r, 0, .9 + ring * .65, -.2 + ring * .8 + elapsed * .02);
      const perspective = 4.4 / (4.4 + z), px = width * .52 + x * scale * perspective, py = height * .45 + y * scale * perspective;
      context.fillStyle = isLight() ? '#333' : '#ddd'; context.fillRect(px - 1.5, py - 1.5, 3, 3);
      if (!ring) { context.fillStyle = '#777'; context.font = '7px monospace'; context.fillText(current === 'engineering' ? 'ME—001' : current === 'development' ? 'DEV—002' : 'VIS—003', px + 9, py + 3); }
    }
  }
  function draw() { drawStars(); drawSculpture(); }
  function loop(now) {
    raf = 0;
    if (paused || document.hidden) { last = 0; return; }
    if (last && now - last < 33) { raf = requestAnimationFrame(loop); return; }
    const dt = last ? Math.min((now - last) / 1000, .06) : .033;
    last = now; elapsed += dt; blend = Math.min(1, blend + dt * .85);
    rx += (targetRx - rx) * .08; ry += (targetRy - ry) * .08; burst *= .95;
    draw(); raf = requestAnimationFrame(loop);
  }
  function start() { if (!raf && !paused && !document.hidden) raf = requestAnimationFrame(loop); }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }
  function setPaused(value) {
    paused = value;
    document.body.classList.toggle('motion-paused', paused);
    toggleMotion.setAttribute('aria-pressed', String(paused));
    toggleMotion.textContent = paused ? 'Resume motion' : 'Pause motion';
    try { sessionStorage.setItem('mission-paused', String(paused)); } catch {}
    if (paused) { blend = 1; stop(); draw(); } else start();
  }
  toggleMotion.addEventListener('click', () => setPaused(!paused));
  reduced.addEventListener('change', e => setPaused(e.matches));
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  document.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  const sceneContent = {
    engineering: { descriptor: 'ENGINEERING / FORM, FORCE & FUNCTION', skills: ['CAD', 'Mechanisms', 'Prototyping'], hint: 'A GEAR / IDEAS THAT MOVE THE PHYSICAL WORLD', projects: [
      { title: 'MonoLyft', meta: 'MECHANICAL DESIGN / GRADE A', href: '/pro/monolyft/' },
      { title: 'Illuminating the Margins', meta: 'SUSTAINABILITY / GRADE A+', href: '/engineering/illuminating-margins.html' }
    ] },
    development: { descriptor: 'DEVELOPMENT / STRUCTURE, LOGIC & CONNECTION', skills: ['React / Vite', 'Firebase', 'Web & Android'], hint: 'A SYSTEM / COMPLEXITY, CONNECTED', projects: [
      { title: 'FoE-SemApp', meta: 'NATIVE AND CROSS-PLATFORM', href: 'https://semapp.nimaat.top' },
      { title: 'The Poet’s Calendar', meta: 'REACT / FIREBASE', href: 'https://tpcalen.vercel.app' }
    ] },
    design: { descriptor: 'DESIGN / IDENTITY, PRINT & MOTION', skills: ['Brand identity', 'Editorial', 'Video'], hint: 'A RIBBON / IDEAS GIVEN A VISUAL LIFE', projects: [
      { title: 'FractalX film', meta: 'VISUAL STORYTELLING', href: '#fractalx-film' },
      { title: 'Visual explorations', meta: 'BRAND / PRINT / DIGITAL', href: '#creative' }
    ] }
  };
  function updateSceneContent(key) {
    const data = sceneContent[key];
    $('#sceneDescriptor').textContent = data.descriptor;
    $('#sceneSkills').replaceChildren(...data.skills.map(text => { const span=document.createElement('span');span.textContent=text;return span; }));
    $('#sceneHint').textContent = data.hint;
    ['#sceneProjectOne','#sceneProjectTwo'].forEach((selector,index) => {
      const link=$(selector), project=data.projects[index];
      link.href=project.href;
      link.querySelector('.scene-node-meta').textContent=project.meta;
      link.querySelector('strong').replaceChildren(document.createTextNode(project.title+' '),Object.assign(document.createElement('span'),{textContent:'↗'}));
      if(project.href.startsWith('https:')){link.target='_blank';link.rel='noopener';}else{link.removeAttribute('target');link.removeAttribute('rel');}
    });
    $('#shapeStatus').textContent = `${key[0].toUpperCase()+key.slice(1)} selected. Explore ${data.projects.map(p=>p.title).join(' and ')}.`;
  }
  $$('[data-shape]').forEach(button => button.addEventListener('click', () => {
    from = current; origins = forms.map((p, i) => positions[i] || p[from]); current = button.dataset.shape; blend = paused ? 1 : 0;
    $$('[data-shape]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    updateSceneContent(current);
    drawSculpture();
  }));
  if (sculpture) {
    sculpture.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || paused) return;
      dragging = true; moved = false; dragX = e.clientX; dragY = e.clientY; sculpture.setPointerCapture(e.pointerId);
    });
    sculpture.addEventListener('pointermove', e => {
      if (!dragging || paused) return;
      const dx = e.clientX - dragX, dy = e.clientY - dragY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      targetRy += dx * .007; targetRx += dy * .007; dragX = e.clientX; dragY = e.clientY;
    });
    sculpture.addEventListener('pointerup', e => { if (!paused && !moved) burst = 1; dragging = false; if (sculpture.hasPointerCapture(e.pointerId)) sculpture.releasePointerCapture(e.pointerId); });
    sculpture.addEventListener('pointercancel', () => { dragging = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { sculptureVisible = entries[0].isIntersecting; if (sculptureVisible) drawSculpture(); }).observe(sculpture);
    new ResizeObserver(resize).observe(sculpture);
  }
  document.addEventListener('mission:theme', draw);
  addEventListener('resize', resize); resize(); setPaused(paused); start();
})();
