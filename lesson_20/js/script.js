
document.addEventListener('click', function (e) {
	const targetElement = e.target;

	if (targetElement.closest('.menu-burger')) {
		document.documentElement.classList.toggle('menu-open');
		e.preventDefault();
	}

})

document.querySelector('.menu-burger').addEventListener('click', function() {
	this.classList.toggle('active');
	
});

 

new Swiper(".swiper-container", {
	navigation: {
		nextEl: '.swiper-button-next', 
		prevEl: '.swiper-button-prev'
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		
	  },

	  loop: true,
	  speed : 1500,
	  effect: 'cube',
    
	
});

const gal = new Swiper(".gal", {
	slidesPerView: 3,
	spaceBetween: 80,
	loop: true,
	autoplay: {
	deley: 1000,
	},
	   
	
  });

















 



	
	
  
  