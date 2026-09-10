const header = document.querySelector('.site-header');
const menu = document.querySelector('.mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const backdrop = document.querySelector('.menu-backdrop');
const socialRail = document.querySelector('.social-rail');
const hero = document.querySelector('.hero');
const footer = document.querySelector('.site-footer');

document.querySelector('#year').textContent = new Date().getFullYear();

function setMenu(open) {
  menu.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
backdrop.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => event.key === 'Escape' && setMenu(false));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(entry => {
      entry.classList.remove('open');
      entry.querySelector('button').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

let heroPassed = false;
let footerVisible = false;

function updateSocialRail() {
  socialRail.classList.toggle('visible', heroPassed && !footerVisible);
}

new IntersectionObserver(([entry]) => {
  heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
  updateSocialRail();
}, { threshold: 0.08 }).observe(hero);

new IntersectionObserver(([entry]) => {
  footerVisible = entry.isIntersecting;
  updateSocialRail();
}, { threshold: 0.02 }).observe(footer);

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

document.querySelectorAll('.lang-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.lang-button').forEach(item => {
      item.classList.toggle('active', item.dataset.lang === button.dataset.lang);
    });
    document.documentElement.lang = button.dataset.lang;
  });
});

document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('mousemove', event => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * .12;
    const y = (event.clientY - rect.top - rect.height / 2) * .12;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('mouseleave', () => button.style.transform = '');
});
