document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.15});
revealEls.forEach(el=>io.observe(el));

// pipeline rail progress + active stage + nav active link
const stages = document.querySelectorAll('.rail-stage');
const railFill = document.getElementById('railFill');
const sections = ['hero','about','skills','projects','freelance','leadership','contact'].map(id=>document.getElementById(id));
const navA = document.querySelectorAll('.nav-links a');

function onScroll(){
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min(1, scrollTop / docH);
  const railMax = document.querySelector('.rail-line').offsetHeight;
  railFill.style.height = (pct*railMax)+'px';

  let activeIdx = 0;
  sections.forEach((s,i)=>{
    if(s && s.getBoundingClientRect().top < window.innerHeight*0.5) activeIdx = i;
  });
  stages.forEach((st,i)=> st.classList.toggle('on', i<=activeIdx));

  navA.forEach(a=>a.classList.remove('active'));
  const id = sections[activeIdx] ? sections[activeIdx].id : 'hero';
  const link = document.querySelector('.nav-links a[href="#'+id+'"]');
  if(link) link.classList.add('active');
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// hero network canvas
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
let W,H, particles=[];
function resize(){
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
function initParticles(){
  particles = [];
  const count = Math.min(110, Math.floor(W/16));
  for(let i=0;i<count;i++){
    particles.push({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.55, vy:(Math.random()-.5)*.55
    });
  }
}
function tick(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
  });
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const d = Math.hypot(a.x-b.x,a.y-b.y);
      if(d<180){
        ctx.strokeStyle ='rgba(41,241,195,'+(1-d/180)*0.30+')';
        
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,1.8,0,Math.PI*2);
    ctx.fillStyle='rgba(140,124,255,.9)';
    ctx.fill();
  });
  requestAnimationFrame(tick);
}
window.addEventListener('resize', ()=>{resize(); initParticles();});
resize(); initParticles(); tick();

// subtle tilt on project cards
document.querySelectorAll('.project-card, .lead-card, .skill-card').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    card.style.transform = 'perspective(800px) rotateY('+(x*4)+'deg) rotateX('+(-y*4)+'deg) translateY(-2px)';
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
});
