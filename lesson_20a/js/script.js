
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



//  Слайдер свайпер

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
	  autoplay: {
	  loop: true,
	  delay: 2000,
	},
	breakpoints: {
	  320: {
		slidesPerView: 1, 
		spaceBetween: 10,
	  },
	  450: {
		slidesPerView: 2, 
		spaceBetween: 15,
	  },

	  680: {
		slidesPerView: 3, 
		spaceBetween: 15,
	  },
	  
	},
  });
  

// Підключення реєстрації 

const wrapper = document.querySelector('.wrap');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const headerRegistratio = document.querySelector('.header__registratio');
const iconClose = document.querySelector('.acon-close');

  
registerLink.addEventListener('click', ()=> {
	wrapper.classList.add('active');
}); 
  
loginLink.addEventListener('click', ()=> {
	wrapper.classList.remove('active');
}); 

headerRegistratio.addEventListener('click', () => {
	wrapper.classList.add('active-registratio');
  });
  
  iconClose.addEventListener('click', () => {
	wrapper.classList.remove('active-registratio');
  });
  
 

















 



	
	
  
  