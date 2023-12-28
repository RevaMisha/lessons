new Swiper(".swiper-container", {
     autoplay: {deley: 1000,
   },
});

const gal = new Swiper(".galeria__slider", {
     slidesPerView: 3,
  spaceBetween: 30,
  autoplay: {
    delay: 1000,
  },
  loop: true, 

  breakpoints: {
      300: {
          slidesPerView: 1, 
          spaceBetween: 20,
            },
        500: {
          slidesPerView: 2, 
          spaceBetween: 25,
        },
   800: {
          slidesPerView: 3, 
          spaceBetween: 30,
        },
        
      },
  
     
  
  


     

});
   
        
        
        

