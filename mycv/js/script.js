
/*Слайдер ОДИН*/ 
new Swiper(".swiper-container", {
   speed: 1000,
   autoplay: {
      delay: 2500,
      disableOnInteraction: false,
   },

   pagination: {
    el: '.about-paginetion',
    clickable: true,  
 },

});

function getCardsGap() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cards-gap'));
}

/*Слайдер ДВА*/ 
const gallery = new Swiper(".galeria__slider", {
     slidesPerView: 3,
  spaceBetween: getCardsGap(),
  speed: 1000,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: true,
  autoHeight: true, 

  breakpoints: {
      300: {
          slidesPerView: 1, 

            },
        500: {
          slidesPerView: 2, 

        },
   800: {
          slidesPerView: 3, 

        },
        
      },
});


// Keep Swiper spacing in sync with the shared CSS breakpoint.
window.matchMedia('(max-width: 900px)').addEventListener('change', () => {
  const gap = getCardsGap();
  gallery.params.spaceBetween = gap;
  gallery.originalParams.spaceBetween = gap;
  gallery.update();
});


function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const header = document.querySelector('.header');
  const headerHeight = header?.offsetHeight ?? 0;
  if (section) {
      window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY - headerHeight,
          behavior: 'smooth'
      });
  }
}


const links = document.querySelectorAll('.header__menu a[href^="#"]');

links.forEach(link => {
  link.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      const toggle = document.querySelector('.header__toggle-menu');
      if (toggle) toggle.checked = false;
      syncDrawerScroll();
      scrollToSection(sectionId);
  });
});
 

        
        
        



// Language dropdown: close it on an outside click or on Escape.
const langDropdowns = document.querySelectorAll('details.header__lang');

document.addEventListener('click', (event) => {
  langDropdowns.forEach(dropdown => {
    if (dropdown.open && !dropdown.contains(event.target)) {
      if (!dropdown.closest('.header__language-item')) dropdown.open = false;
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  langDropdowns.forEach(dropdown => {
    if (!dropdown.closest('.header__language-item')) dropdown.open = false;
  });
});

// Move the existing language control into the mobile menu, preserving its links.
const languageControl = document.querySelector('.header__lang');
const navigationMenu = document.querySelector('.header__menu');
const languageHome = document.createComment('Language control desktop position');
languageControl.before(languageHome);
const languageSlot = document.createElement('li');
languageSlot.className = 'header__language-item';
const mobileNavigation = window.matchMedia('(max-width: 959.5px)');
function positionLanguageControl() {
  languageControl.open = false;
  if (mobileNavigation.matches) {
    navigationMenu.append(languageSlot);
    languageSlot.append(languageControl);
    languageControl.open = true;
    languageControl.querySelector('[lang="en"]').firstChild.textContent = 'Eng ';
  } else {
    languageHome.after(languageControl);
    languageControl.querySelector('[lang="en"]').firstChild.textContent = 'EN ';
    languageSlot.remove();
  }
}
positionLanguageControl();
mobileNavigation.addEventListener('change', positionLanguageControl);

// Freeze the page while retaining independent scrolling inside the drawer.
const drawerToggle = document.querySelector('.header__toggle-menu');
let drawerScrollPosition = null;
function syncDrawerScroll() {
  const open = mobileNavigation.matches && drawerToggle.checked;
  if (open && drawerScrollPosition === null) {
    drawerScrollPosition = window.scrollY;
    document.body.style.setProperty('--drawer-scroll-top', '-' + drawerScrollPosition + 'px');
    document.body.classList.add('drawer-open');
  } else if (!open && drawerScrollPosition !== null) {
    const position = drawerScrollPosition;
    drawerScrollPosition = null;
    document.body.classList.remove('drawer-open');
    document.body.style.removeProperty('--drawer-scroll-top');
    window.scrollTo({ top: position, behavior: 'instant' });
  }
}
function closeDrawer() {
  drawerToggle.checked = false;
  syncDrawerScroll();
}
drawerToggle.addEventListener('change', syncDrawerScroll);
document.addEventListener('click', (event) => {
  if (!mobileNavigation.matches || !drawerToggle.checked) return;
  if (navigationMenu.contains(event.target) || event.target.closest('.header__toggle-menu, .header__gamburger')) return;
  event.preventDefault();
  event.stopPropagation();
  closeDrawer();
}, true);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeDrawer();
});
mobileNavigation.addEventListener('change', () => {
  if (!mobileNavigation.matches) closeDrawer();
});
window.addEventListener('pageshow', syncDrawerScroll);
