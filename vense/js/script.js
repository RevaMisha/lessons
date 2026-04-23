


document.addEventListener("click", function (e) {
	const targetElement = e.target;

	if (targetElement.closest('.paige-content__menu-burger')) {
		document.documentElement.classList.toggle('menu-open');
		e.preventDefault();
	}

})