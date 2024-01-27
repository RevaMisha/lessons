new Swiper(".swiper-container", {
    navigation: {
        nextEl: '.swiper-button-next', 
        prevEl: '.swiper-button-prev'
    },

    pagination: {
        el: '.swiper-pagination',
      },
    autoplay: {
        deley: 2500,
           },
       
});


function scrollToSection(sectionId) {
    var element = document.getElementById(sectionId);
    var offset = document.querySelector('header').offsetHeight; // Висота хедера
    var targetPosition = element.offsetTop - offset;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime;
    var duration = 1000; // 1 секунда

    function animation(currentTime) {
      if (startTime === undefined) startTime = currentTime;
      var timeElapsed = currentTime - startTime;
      var run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

 