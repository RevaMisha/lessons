
$('.content__slider').slick(
	{  arrows: true,
});


$('.content__slider-goods').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 3,
	arrows: false,
	dots: true,
	responsive: [
		{
		  breakpoint: 765,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 2,
			infinite: true,
			dots: true
		  }
		},
		{
			breakpoint: 391,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1
			}
		  },
	
	
	]
	
  });

  $('.content__reviews-slider').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 3,
	arrows: false,
	dots: true,
	responsive: [
		{
		  breakpoint: 762,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 2,
			infinite: true,
			dots: true
		  }
		},
		{
			breakpoint: 449,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1
			}
		  },
	]
});
	



document.addEventListener("click", function (e) {
	const targetElement = e.target;

	if (targetElement.closest('.header__burger-menu')) {
		document.documentElement.classList.toggle('menu-open');
		e.preventDefault();
	}

})



	


  