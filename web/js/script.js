const swiper = new Swiper('.swiper-container', {
  autoplay: {
    loop: true,
    delay: 2000, },
  spaceBetween: 20,
  breakpoints: {
    400: {
      slidesPerView: 1, },
    600: {
      slidesPerView: 2,
      spaceBetween: 15 },
    800: {
      slidesPerView: 3,
      spaceBetween: 20 },
   1000: {
      slidesPerView: 4, }
    },
});



