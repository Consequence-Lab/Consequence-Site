/* ConSEQuence Lab - Vanilla JavaScript (no dependencies) */
document.documentElement.classList.add('js');

// Edit this address before publishing if the lab should use a different mailbox.
const LAB_EMAIL = 'tpope@ncat.edu';

const researchPillars = {
  ai: {
    index: '01 / 04', emblem: 'AI', eyebrow: 'UNDERSTANDING INTELLIGENCE',
    title: 'Artificial Intelligence',
    description: 'We study how intelligent systems learn, represent information, and behave, with an emphasis on interpretability and meaningful evaluation.',
    directions: [
      'Mechanistic interpretability and explainable AI',
      'Model behavior and evaluation',
      'Intelligent and autonomous systems'
    ]
  },
  quantum: {
    index: '02 / 04', emblem: 'Q', eyebrow: 'EXPLORING COMPUTATION',
    title: 'Quantum Computing',
    description: 'We investigate quantum and hybrid computing methods, examine their capabilities, and evaluate when they offer useful advances over classical approaches.',
    directions: [
      'Quantum algorithms and computing methods',
      'Quantum machine learning',
      'Hybrid quantum-classical systems'
    ]
  },
  discovery: {
    index: '03 / 04', emblem: 'CD', eyebrow: 'ADVANCING DISCOVERY',
    title: 'Computational Discovery',
    description: 'We explore how AI and emerging computing approaches can help investigate biological and scientific problems, while studying the limits of computational predictions.',
    directions: [
      'Generative models for biological systems',
      'AI-assisted scientific discovery',
      'Evaluation and validation of computational methods'
    ]
  },
  security: {
    index: '04 / 04', emblem: 'TS', eyebrow: 'BUILDING TRUST',
    title: 'Trust & Security',
    description: 'We examine threats, failures, and unexpected behavior in intelligent systems, and develop practical ways to assess reliability and security.',
    directions: [
      'Adversarial testing and security evaluation',
      'Robustness and model assurance',
      'Understanding failure modes and misuse risks'
    ]
  }
};

function selectPillar(key) {
  const pillar = researchPillars[key];
  if (!pillar) return;

  document.querySelectorAll('[data-pillar]').forEach(button => {
    const selected = button.dataset.pillar === key;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  const fields = {
    'detail-index': pillar.index,
    'detail-emblem': pillar.emblem,
    'detail-eyebrow': pillar.eyebrow,
    'detail-title': pillar.title,
    'detail-description': pillar.description
  };
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });

  const list = document.getElementById('detail-list');
  if (list) {
    list.replaceChildren(...pillar.directions.map(direction => {
      const li = document.createElement('li');
      li.textContent = direction;
      return li;
    }));
  }
}

document.querySelectorAll('[data-pillar]').forEach(button => {
  button.addEventListener('click', () => selectPillar(button.dataset.pillar));
});

// Responsive navigation.
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('primary-nav');
function closeMenu() {
  if (!nav || !menuToggle) return;
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

// Light scroll reveal with an accessible no-animation fallback.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: .08 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('in-view'));
}

// Scroll progress indicator and navigation state.
const progress = document.getElementById('scroll-progress');
let scrollScheduled = false;
function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const value = maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0;
  if (progress) progress.style.width = `${Math.max(0, Math.min(100, value))}%`;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    window.requestAnimationFrame(updateProgress);
    scrollScheduled = true;
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');
if ('IntersectionObserver' in window) {
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sectionLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

// Simple configuration so the contact link does not rely on a server-side form.
const emailLink = document.getElementById('contact-email');
if (emailLink) emailLink.href = `mailto:${LAB_EMAIL}?subject=${encodeURIComponent('ConSEQuence Lab Inquiry')}`;
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Undergraduate cohort directory: class-year filters.
const studentFilterButtons = document.querySelectorAll('[data-filter]');
const studentDirectoryCards = document.querySelectorAll('[data-student-year]');
studentFilterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    studentFilterButtons.forEach(btn => {
      const selected = btn === button;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    studentDirectoryCards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.studentYear !== category;
    });
  });
});

// PI photo uses the public Google Scholar profile image where available.
// If it fails, an initial-based monogram remains visible. A local image is recommended for reliable hosting.
const piPortrait = document.querySelector('.pi-photo');
if (piPortrait) {
  piPortrait.addEventListener('load', () => { piPortrait.hidden = false; });
  piPortrait.addEventListener('error', () => { piPortrait.hidden = true; });
  if (piPortrait.complete && piPortrait.naturalWidth > 0) piPortrait.hidden = false;
}


// Research publication explorer; nodes are organized by subject, not coauthors/citations.
(function initPublications() {
  const data = document.getElementById('publication-data');
  if (!data) return;
  let items;
  try { items = JSON.parse(data.textContent); } catch(error) { console.warn('Publication data unavailable', error); return; }
  const buttons = [...document.querySelectorAll('[data-pub-view]')];
  const listPane = document.getElementById('pub-list-pane');
  const networkPane = document.getElementById('pub-network-pane');
  const expand = document.getElementById('pub-expand-all');
  const years = [...document.querySelectorAll('.pub-year')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const network = button.dataset.pubView === 'network';
    buttons.forEach(btn => {
      const selected = btn === button;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    listPane.hidden = network;
    networkPane.hidden = !network;
    expand.hidden = network;
    if(network) renderNetwork();
  }));
  const updateExpandLabel = () => { expand.textContent = years.every(y=>y.open) ? 'Collapse all years' : 'Expand all years'; };
  years.forEach(year => year.addEventListener('toggle', updateExpandLabel));
  expand.addEventListener('click', () => {
    const shouldOpen = !years.every(y=>y.open);
    years.forEach(y => y.open = shouldOpen);
    updateExpandLabel();
  });
  const NS='http://www.w3.org/2000/svg';
  const svg=document.getElementById('pub-network-svg');
  const topic = {
    bioai:{title:'BioAI & Discovery',x:255,y:165,color:'#67c6e9'},
    security:{title:'Trust & Security',x:690,y:165,color:'#b4a8ff'},
    health:{title:'AI for Health',x:260,y:440,color:'#8fd6bc'},
    quantum:{title:'Quantum',x:685,y:440,color:'#e8b87a'}
  };
  let rendered=false;
  function element(tag, attrs={}, value=null) {
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([key,val])=>el.setAttribute(key,String(val)));
    if(value!==null) el.textContent=value;
    return el;
  }
  function selectPaper(p, node) {
    svg.querySelectorAll('.network-dot').forEach(n=>n.classList.toggle('is-selected',n===node));
    document.getElementById('network-paper-title').textContent=p.title;
    document.getElementById('network-paper-meta').textContent=`${p.y} · ${p.kind} · ${topic[p.theme].title}\n${p.authors.split(';').join(' · ')}\n${p.venue}`;
    const a=document.getElementById('network-paper-link');
    a.href=p.url;
    a.textContent='View publication record ↗';
  }
  function renderNetwork(){
    if(rendered) return;
    rendered=true;
    const linegroup=element('g',{'aria-hidden':'true'});
    const group=element('g');
    svg.append(linegroup,group);
    Object.values(topic).forEach(t => {
      linegroup.append(element('line',{x1:475,y1:290,x2:t.x,y2:t.y,class:'network-edge'}));
      const circle=element('circle',{cx:t.x,cy:t.y,r:57,class:'network-themecircle',stroke:t.color});
      group.append(circle);
      const pieces=t.title==='BioAI & Discovery'?['BioAI &','Discovery']:t.title==='Trust & Security'?['Trust &','Security']:t.title==='AI for Health'?['AI for','Health']:['Quantum'];
      pieces.forEach((line,i)=>group.append(element('text',{x:t.x,y:t.y+(i-(pieces.length-1)/2)*19+4,'text-anchor':'middle',class:'network-theme-text'},line)));
      group.append(element('text',{x:t.x,y:t.y+41,'text-anchor':'middle',class:'network-theme-count'},String(items.filter(p=>p.theme===Object.keys(topic).find(k=>topic[k]===t)).length).padStart(2,'0')));
    });
    const center=element('circle',{cx:475,cy:290,r:69,class:'network-center'});
    group.append(center);
    group.append(element('text',{x:475,y:284,'text-anchor':'middle',class:'network-center-label'},'ConSEQuence'));
    group.append(element('text',{x:475,y:309,'text-anchor':'middle',class:'network-theme-count'},'LAB / RESEARCH'));
    Object.entries(topic).forEach(([key,t])=>{
      const publications=items.filter(p=>p.theme===key);
      publications.forEach((p,index)=>{
        const count=publications.length;
        const angle=(2*Math.PI*index/count) - Math.PI/2 + 0.27;
        const radius=count>7?104:count>3?106:100;
        const x=t.x + Math.cos(angle)*radius;
        const y=t.y + Math.sin(angle)*radius;
        linegroup.append(element('line',{x1:t.x,y1:t.y,x2:x,y2:y,class:'network-edge network-edge-to-paper'}));
        const node=element('g',{class:'network-node',tabindex:0,role:'button','aria-label':`${p.title}, ${p.y}`});
        const dot=element('circle',{cx:x,cy:y,r:count>7?8.5:10,fill:t.color,class:'network-dot'});
        node.append(dot,element('title',{},p.title));
        const choose=()=>selectPaper(p,dot);
        node.addEventListener('click',choose);
        node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
        group.append(node);
      });
    });
  }
})();
