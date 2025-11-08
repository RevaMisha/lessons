
/*Слайдер ОДИН*/ 
new Swiper(".swiper-container", {
     autoplay: {deley: 1000,
   },

   pagination: {
    el: '.swiper-pagination',
    clickable: true,  
 },

});

/*Слайдер ДВА*/ 
const gal = new Swiper(".galeria__slider", {
     slidesPerView: 3,
  spaceBetween: 25,
  autoplay: {
    delay: 1000,
  },
  loop: true,
  autoHeight: true, 

  breakpoints: {
      300: {
          slidesPerView: 1, 
          spaceBetween: 10,
            },
        500: {
          slidesPerView: 2, 
          spaceBetween: 15,
        },
   800: {
          slidesPerView: 3, 
          spaceBetween: 20,
        },
        
      },
});


function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const header = document.querySelector('.header');
  const heightHeight = header?.scrollHeight;
  if (section) {
      window.scrollTo({
          top: section.offsetTop -( heightHeight ? heightHeight : 0),
          behavior: 'smooth'
      });
  }
}


const links = document.querySelectorAll('.header__menu a');

links.forEach(link => {
  link.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      scrollToSection(sectionId);
  });
});
 

        
        
        

